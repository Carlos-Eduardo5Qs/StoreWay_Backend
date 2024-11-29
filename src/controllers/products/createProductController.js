/* eslint-disable camelcase */
const CreateProduct = require('../../services/products/CreateProductService');

exports.create = async (req, res) => {
  const {
    name, description, price, category_id, brand, stock,
  } = req.body;

  if (!name || !req.file || !description || !price || !category_id || !brand || !stock) {
    return res.status(400).json({ data: { message: 'All field are mandatory.' } });
  }

  try {
    const createProduct = new CreateProduct(name, req.file, description, price, category_id, brand, stock); const result = await createProduct.create();

    if (!result) {
      return res.status(500).json({ data: { message: 'Something wrong happened, sorry :(' } });
    }

    res.status(200).json({ message: 'Created product successfuly.' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ data: { message: 'An error occurred while creating the product. Please try again later.' } });
  }
};
