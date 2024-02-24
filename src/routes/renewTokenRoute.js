const express = require('express');

const renewTokenController = require('../controllers/renewTokenController');

const router = express.Router();

router.post('/token/refresh', renewTokenController.renew);

module.exports = router;
