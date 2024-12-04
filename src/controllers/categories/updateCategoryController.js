const FindCategoryModel = require('../../models/categories/FindCategoryModel');
const FindCategoryModelById = require('../../models/categories/FindCategoryByIdModel');
const UpdateCategoryModel = require('../../models/categories/UpdateCategoryModel');

exports.update = async function (req, res) {
  const { newName } = req.body;
  const { idCategory } = req.params;

  if (!newName || !idCategory) {
    return res.status(400).json({ data: { message: 'newName and idCategory fields are mandatory.' } });
  }

  try {
    const findCategoryModelById = new FindCategoryModelById(idCategory);
    const existingCategory = await findCategoryModelById.find();

    if (!existingCategory) return res.status(404).json({ data: { message: 'Category not found.' } });

    const findCategory = new FindCategoryModel(newName);
    const category = await findCategory.find();

    if (category.name === newName) {
      return res.status(409).json({ data: { message: 'The category is up-to-date.' } });
    }

    const updateCategoryModel = new UpdateCategoryModel(newName, idCategory);
    const result = await updateCategoryModel.update();

    if (!result) return res.status(500).json({ data: { message: 'Failed to update category. Please try again later.' } });

    return res.status(200).json({ data: { message: 'Category updated successfuly.' } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ data: { message: 'An error occurres while updating category. Please try again later.' } });
  }
};
