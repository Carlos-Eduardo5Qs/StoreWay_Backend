/* eslint-disable radix */
/* eslint-disable camelcase */
require('dotenv').config();

const B2 = require('backblaze-b2');

const CheckProduct = require('../../models/products/SearchProductModel');
const UpdatedProductModel = require('../../models/products/UpdateProductModel');

function UpdateProduct(id, name, image, description, price, category_id, brand, stock) {
  this.id = id;
  this.name = name;
  this.image = image;
  this.description = description;
  this.price = price;
  this.category = category_id;
  this.brand = brand;
  this.stock = stock;

  this.b2 = new B2({
    applicationKeyId: process.env.KEY_ID,
    applicationKey: process.env.APP_KEY,
  });
}

UpdateProduct.prototype.updateProduct = async function () {
  const currentProduct = await this.searchProduct();

  if (!currentProduct) return false;

  const isUpdated = this.isProductUpdated(currentProduct);

  const results = isUpdated ? 'true' : 'false';

  if (results === 'false') return 'false';

  const updateImages = await this.updateImage();

  if (!updateImages) return false;

  const product = [
    this.name,
    updateImages.url,
    updateImages.id,
    updateImages.fileName,
    this.description,
    this.price,
    this.category,
    this.brand,
    this.stock,
    this.id,
  ];

  const update = new UpdatedProductModel(product);
  const result = await update.update();

  if (!result) {
    return false;
  } else {
    return true;
  }
};

UpdateProduct.prototype.isProductUpdated = function (currentProduct) {
  const nameImageOne = this.image?.originalname || '';
  const nameImageTwo = currentProduct.image_filename ? currentProduct.image_filename.split('/').pop() : '';

  return (
    this.name.trim() !== currentProduct.name.trim()
    || nameImageOne.trim() !== nameImageTwo.trim()
    || this.description.trim() !== currentProduct.description.trim()
    || parseFloat(this.price) !== parseFloat(currentProduct.price)
    || parseInt(this.category, 10) !== parseInt(currentProduct.category_id, 10)
    || this.brand.trim() !== currentProduct.brand.trim()
    || parseInt(this.stock) !== parseInt(currentProduct.stock)
  );
};

UpdateProduct.prototype.updateImage = async function () {
  try {
    const product = await this.searchProduct();

    if (!product) return false;

    const fileExists = await this.doesFileExist(product.image_filename);

    if (!fileExists) throw new Error('Error when updating product.');

    await this.deleteImage(product.image_filename, product.image_id);

    const update = await this.uploadImage();

    return update;
  } catch (error) {
    throw new Error(`Error updating image: ${error.message}`);
  }
};

UpdateProduct.prototype.uploadImage = async function () {
  try {
    const authResponse = await this.b2.authorize();
    const { downloadUrl } = authResponse.data;

    const response = await this.b2.getUploadUrl({ bucketId: process.env.BUCKET_ID });
    const { authorizationToken, uploadUrl } = response.data;

    const params = {
      uploadUrl,
      uploadAuthToken: authorizationToken,
      fileName: `products/${this.image.originalname}`,
      data: this.image.buffer,
    };

    const fileInfo = await this.b2.uploadFile(params);
    const url = `${downloadUrl}/file/${process.env.BUCKET_NAME}/${params.fileName}`;

    return { url, id: fileInfo.data.fileId, fileName: fileInfo.data.fileName };
  } catch (error) {
    throw new Error(`Error uploading image: ${error.message}`);
  }
};

UpdateProduct.prototype.deleteImage = async function (fileName, fileId) {
  try {
    await this.b2.authorize();

    await this.b2.deleteFileVersion({
      fileName,
      fileId,
    });
  } catch (error) {
    throw new Error(`Error deleting file ${fileName} with fileId ${fileId}: ${error.message}`);
  }
};

UpdateProduct.prototype.searchProduct = async function () {
  try {
    const checkProduct = new CheckProduct(this.id);
    const product = await checkProduct.find();
    return product;
  } catch (error) {
    throw new Error(`Error fiding product: ${error.message}`);
  }
};

UpdateProduct.prototype.doesFileExist = async function (fileName) {
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
    throw new Error(`Error checking if the file exists: ${error.message}`);
  }
};

module.exports = UpdateProduct;
