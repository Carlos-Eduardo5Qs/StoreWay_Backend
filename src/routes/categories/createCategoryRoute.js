const express = require('express');

const createCategory = require('../../controllers/categories/createCategoryController');

const verifyAuthorizarion = require('../../middlewares/verifyAuthorizarion');

const router = express.Router();

router.post('/categories/create', verifyAuthorizarion, createCategory.create);

module.exports = router;
