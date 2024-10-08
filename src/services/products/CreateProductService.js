require('dotenv').config();

const B2 = require('backblaze-b2');

const RegisterProduct = require('../../models/products/CreateProductModel');

function CreateProduct(name, image, description, price, category, brand, stock) {
  this.name = name;
  this.image = image;
  this.description = description;
  this.price = Number(price).toFixed(2);
  this.category = category;
  this.brand = brand;
  this.stock = parseInt(stock, 10);
}

CreateProduct.prototype.create = async function () {
  const uploadedImage = await this.uploadImage();
  const product = [
    this.name,
    uploadedImage.url,
    uploadedImage.id,
    uploadedImage.fileName,
    this.description,
    this.price,
    this.category,
    this.brand,
    this.stock,
  ];

  const createProduct = new RegisterProduct(product);
  const result = await createProduct.register();

  if (!result) {
    return false;
  } else {
    return true;
  }
};

CreateProduct.prototype.uploadImage = async function () {
  try {
    const b2 = new B2({
      applicationKeyId: process.env.KEY_ID,
      applicationKey: process.env.APP_KEY,
    });

    const authResponse = await b2.authorize();
    const { downloadUrl } = authResponse.data;

    const response = await b2.getUploadUrl({ bucketId: process.env.BUCKET_ID });
    const { authorizationToken, uploadUrl } = response.data;

    const params = {
      uploadUrl,
      uploadAuthToken: authorizationToken,
      fileName: `products/${this.image.originalname}`,
      data: this.image.buffer,
    };

    const fileInfo = await b2.uploadFile(params);
    const url = `${downloadUrl}/file/${process.env.BUCKET_NAME}/${params.fileName}`;

    return { url, id: fileInfo.data.fileId, fileName: fileInfo.data.fileName };
  } catch (error) {
    throw new Error(`Error uploading image the product: ${error.message}`);
  }
};

module.exports = CreateProduct;
