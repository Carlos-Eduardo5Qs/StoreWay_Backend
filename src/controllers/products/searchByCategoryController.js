const SearchByCategoryModel = require('../../models/products/SearchByCategoryModel');

exports.searchByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    if (!category) return res.status(403).json({ data: { message: 'Error' } });

    const searchByCategory = new SearchByCategoryModel(category);
    const results = await searchByCategory.search();

    if (!results) return res.status(404).json({ data: { message: 'No products found in this category' } });

    const products = results.map((product) => {
      // eslint-disable-next-line camelcase
      const { image_id, image_filename, ...rest } = product;
      return rest;
    });
    res.status(200).json({ data: { message: products } });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ data: { message: 'An error occurred while listing the products by category. Please try again later.' } });
  }
};
