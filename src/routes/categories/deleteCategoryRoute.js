const express = require('express');

const deleteCategory = require('../../controllers/categories/deleteCategoryController');

const verifyAuthorizarion = require('../../middlewares/verifyAuthorizarion');

const router = express.Router();

router.delete('/categories/delete/:idCategory', verifyAuthorizarion, deleteCategory.delete);

module.exports = router;
