const FindCategoryByIdModel = require('../../models/categories/FindCategoryByIdModel');
const DeleteCategoryModel = require('../../models/categories/DeleteCategoryModel');

exports.delete = async function (req, res) {
  const { idCategory } = req.params;

  if (!idCategory) return res.status(400).json({ data: { message: 'idCategory field is mandatory.' } });

  try {
    const findCategoryByIdModel = new FindCategoryByIdModel(idCategory);
    const category = await findCategoryByIdModel.find();

    if (!category) return res.status(404).json({ data: { message: 'Category not found.' } });

    const deleteCategoryModel = new DeleteCategoryModel(idCategory);
    const result = await deleteCategoryModel.delete();

    if (!result) return res.status(500).json({ data: { message: 'Category could not be deleted. Please try again later.' } });

    return res.status(200).json({ data: { message: 'Category deleted successfully.' } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ data: { message: 'An error occurres while deleting category. Please try again later.' } });
  }
};
