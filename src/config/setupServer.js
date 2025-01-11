const express = require('express');
const cors = require('cors');

const createAccountRoute = require('../routes/users/createAccountRoute');
const emailVerificationRoute = require('../routes/users/emailVerificationRoute');
const loginRoute = require('../routes/users/authRoute');
const renewTokenRoute = require('../routes/auth/renewTokenRoute');
const createProductRoute = require('../routes/products/createProductRoute');
const updateProductRoute = require('../routes/products/updateProductRoute');
const deleteProductRoute = require('../routes/products/deleteProductRoute');
const searchAllProductsRoute = require('../routes/products/searchAllProductsRoute');
const searchByCategoryRoute = require('../routes/products/searchByCategoryRoute');
const createAssessmentRoute = require('../routes/productsAssessments/createAssessmentRoute');
const addPhotoToAssessmentRoute = require('../routes/productsAssessments/addPhotoToAssessmentsRoute');
const updateAssessmentRoute = require('../routes/productsAssessments/updateAssessmentsRoute');
const createCategoryRoute = require('../routes/categories/createCategoryRoute');
const updateCategoryRoute = require('../routes/categories/updateCategoryRoute');
const deleteCategoryRoute = require('../routes/categories/deleteCategoryRoute');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(createAccountRoute);
app.use(loginRoute);
app.use(renewTokenRoute);
app.use(createProductRoute);
app.use(updateProductRoute);
app.use(deleteProductRoute);
app.use(searchAllProductsRoute);
app.use(searchByCategoryRoute);
app.use(createAssessmentRoute);
app.use(addPhotoToAssessmentRoute);
app.use(updateAssessmentRoute);
app.use(createCategoryRoute);
app.use(updateCategoryRoute);
app.use(deleteCategoryRoute);
app.use(emailVerificationRoute);

module.exports = app;
