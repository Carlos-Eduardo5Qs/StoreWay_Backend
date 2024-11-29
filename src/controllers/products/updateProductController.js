/* eslint-disable camelcase */
const UpdateProduct = require('../../services/products/UpdateProductService');

exports.update = async (req, res) => {
  const {
    name, description, price, category_id, brand, stock,
  } = req.body;

  const { id } = req.params;

  if (!id || !name || !req.file || !description || !price || !category_id || !brand || !stock) {
    return res.status(400).json({ data: { message: 'All fields mandatory.' } });
  }

  try {
    const updateProduct = new UpdateProduct(id, name, req.file, description, price, category_id, brand, stock);
    const result = await updateProduct.updateProduct();

    if (!result) return res.status(404).json({ data: { message: 'Product not found' } });
    if (result === 'false') return res.status(409).json({ data: { message: 'Product is up to date' } });

    res.status(200).json({ data: { message: 'Updated product successfuly.' } });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ data: { message: 'An error occurred while updating the product. Please try again later.' } });
  }
};
