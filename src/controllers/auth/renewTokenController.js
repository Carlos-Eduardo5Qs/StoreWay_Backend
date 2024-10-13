/* eslint-disable max-len */
require('dotenv').config();

const jwt = require('jsonwebtoken');

exports.renew = (req, res) => {
  const { refreshToken } = req.body;

  try {
    const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY);
    const newAccessToken = jwt.sign({ id: decoded.id }, process.env.SECRET_KEY, { expiresIn: 900 });
    const newRefreshToken = jwt.sign({ id: decoded.id }, process.env.SECRET_KEY, { expiresIn: 1200 });

    res.status(200).json({
      data: {
        newAccessToken,
        newRefreshToken,
      },
    });
  } catch (error) {
    res.status(403).json({ data: { message: 'Invalid refresh token' } });
  }
};
