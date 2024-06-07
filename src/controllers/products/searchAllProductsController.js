const SearchAllProducts = require('../../models/products/SearchAllProductsModel');

exports.searchAllProducts = async (req, res) => {
  try {
    const searchAllProducts = new SearchAllProducts();
    const allProducts = await searchAllProducts.search();

    if (!allProducts) return res.status(404).json({ data: { message: 'No products found;' } });

    const productsToSend = allProducts.map((products) => {
      // eslint-disable-next-line camelcase
      const { image_id, image_filename, ...rest } = products;
      return rest;
    });

    res.status(200).json({ data: { products: productsToSend } });
  } catch (error) {
    return res.status(500).json({ data: { message: 'Internal Server Error.' } });
  }
};
