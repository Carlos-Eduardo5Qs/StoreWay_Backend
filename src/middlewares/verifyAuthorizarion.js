require('dotenv').config();

const jwt = require('jsonwebtoken');

const VerifyAuthorizationModel = require('../models/users/verifyAuthorizarionModel');

async function verify(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) return res.status(401).json({ data: { message: 'Authorization token not provided.' } });

  try {
    const decodedToken = jwt.verify(authorization, process.env.SECRET_KEY, { ignoreExpiration: true });
    const userId = decodedToken.id;

    const verifyAuthorizarionModel = new VerifyAuthorizationModel(userId);
    const check = await verifyAuthorizarionModel.isAdm();

    if (!check) {
      return res.status(403).json({ data: { message: 'Access denied.' } });
    } else {
      next();
    }
  } catch (error) {
    return res.status(401).json({ data: { message: 'Invalid token.' } });
  }
}

module.exports = verify;
