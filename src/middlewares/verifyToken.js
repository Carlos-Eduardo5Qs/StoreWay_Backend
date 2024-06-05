require('dotenv').config();

const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Token not provide' });
  }

  try {
    const decoded = jwt.verify(authorization, process.env.SECRET_KEY, { ignoreExpiration: true });
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
}

module.exports = verifyToken;
