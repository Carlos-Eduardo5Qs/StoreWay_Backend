const express = require('express');

const uptdateCategory = require('../../controllers/categories/updateCategoryController');

const verifyAuthorizarion = require('../../middlewares/verifyAuthorizarion');

const router = express.Router();

router.put('/categories/update/:idCategory', verifyAuthorizarion, uptdateCategory.update);

module.exports = router;
