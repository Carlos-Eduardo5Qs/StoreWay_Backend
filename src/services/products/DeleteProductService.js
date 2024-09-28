require('dotenv').config();

const B2 = require('backblaze-b2');

const SearchProduct = require('../../models/products/SearchProductModel');
const DeleteProducts = require('../../models/products/DeleteProductModel');

function DeleteProduct(id) {
  this.id = id;

  this.b2 = new B2({
    applicationKeyId: process.env.KEY_ID,
    applicationKey: process.env.APP_KEY,
  });
}

DeleteProduct.prototype.delete = async function () {
  const product = await this.findProduct();
  const doesFileExist = await this.doesFileExist(product.image_filename);

  if (!product || !doesFileExist) return false;

  await this.deleteImage(product.image_filename, product.image_id);

  const deleteProductFromDatabase = new DeleteProducts(product.id);
  const result = await deleteProductFromDatabase.delete();

  if (!result) {
    return false;
  } else {
    return true;
  }
};

DeleteProduct.prototype.findProduct = async function () {
  try {
    const searchProduct = new SearchProduct(this.id);
    const product = await searchProduct.find();
    return product;
  } catch (error) {
    throw new Error(`Error fiding products: ${error.message}`);
  }
};

DeleteProduct.prototype.doesFileExist = async function (fileName) {
  try {
    await this.b2.authorize();

    const file = await this.b2.listFileNames({
      bucketId: process.env.BUCKET_ID,
      startFileName: fileName,
      maxFileCount: 1,
    });

    if (file.data.files.length === 0) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    throw new Error(`Error confirming file existence: ${error.message}`);
  }
};

DeleteProduct.prototype.deleteImage = async function (fileName, fileId) {
  if (!fileName || !fileId) {
    throw new Error(`Error: fileName or fileId not set. fileName: ${fileName}, fileId: ${fileId}`);
  }

  try {
    await this.b2.authorize();

    await this.b2.deleteFileVersion({
      fileName,
      fileId,
    });
  } catch (error) {
    throw new Error(`Error deleting file: ${error.message}`);
  }
};

module.exports = DeleteProduct;
