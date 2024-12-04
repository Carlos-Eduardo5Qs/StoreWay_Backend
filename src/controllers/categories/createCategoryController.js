const CheckCategoryExists = require('../../models/categories/CheckCategoryExistsModel');
const CreateCategoryModel = require('../../models/categories/CreateCategoryModel');

exports.create = async (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ data: { message: 'Name field is mandatory.' } });

  try {
    const checkCategoryExists = new CheckCategoryExists(name);
    const checkingIfCategoryExists = await checkCategoryExists.check();

    if (checkingIfCategoryExists) return res.status(409).json({ data: { message: 'Category already exists' } });

    const createCategoryModel = new CreateCategoryModel(name);
    const result = await createCategoryModel.create();

    if (!result) return res.status(500).json({ data: { message: 'Failed to create category. Please try again later.' } });

    return res.status(200).json({ data: { message: 'Category created successfuly' } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ data: { message: 'An error occurres while creating category. Please try again later.' } });
  }
};
