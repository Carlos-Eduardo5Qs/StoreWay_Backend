const express = require('express');
const verifyToken = require('../../middlewares/verifyToken');
const updateAssessmentController = require('../../controllers/productsAssessments/updateAssessmentsController');

const router = express.Router();

router.put('/products/UpdateAssessment', verifyToken, updateAssessmentController.updateAssessemts);

module.exports = router;
