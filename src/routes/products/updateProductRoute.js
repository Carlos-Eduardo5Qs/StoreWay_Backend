const express = require('express');
const multer = require('multer');

const router = express.Router();

const updateProductController = require('../../controllers/products/updateProductController');
const verifyAuthorization = require('../../middlewares/verifyAuthorizarion');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.put('/products/update/:id', verifyAuthorization, upload.single('file'), updateProductController.update);

module.exports = router;
