const EmailVerificationService = require('../../services/users/EmailVerificationService');

exports.emailVerification = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) return res.status(400).json({ data: { message: 'Token is required!' } });

    const emailVerification = new EmailVerificationService(token);
    const isVerified = await emailVerification.verify();

    if (!isVerified.isValid) return res.status(401).json({ data: { message: isVerified.error } });

    if (isVerified.accountActive) return res.status(200).json({ data: { message: 'Account already verified!' } });

    res.status(200).json({ data: { message: 'Account verified!' } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ data: { message: 'Internal Server Error' } });
  }
};
