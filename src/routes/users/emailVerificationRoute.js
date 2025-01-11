const express = require('express');

const emailVerificationControlle = require('../../controllers/users/emailVerificationController');

const router = express.Router();

router.get('/users/email-verification/:token', emailVerificationControlle.emailVerification);

module.exports = router;
