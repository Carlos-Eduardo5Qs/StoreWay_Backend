const DeleteProduct = require('../../services/products/DeleteProductService');

exports.delete = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ data: { message: 'Invalid product ID.' } });
  }

  try {
    const deleteProduct = new DeleteProduct(id);
    const result = await deleteProduct.delete();

    if (!result) {
      return res.status(404).json({ data: { message: 'Product not found' } });
    }

    return res.status(200).json({ data: { message: 'Product Deleted successfully' } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ data: { message: 'An error occurred while deleting the product. Please try again later.' } });
  }
};
