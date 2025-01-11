require('dotenv').config();

const jwt = require('jsonwebtoken');

const EmailVerificationModel = require('../../models/users/EmailVerificationModel');
const FindUser = require('../../models/users/FindUserModel');

function EmailVerification(token) {
  this.token = token;
  this.tokenValidationResult = {
    error: null,
    isValid: false,
    payload: null,
    accountActive: false,
  };
  this.accountActive = false;
}

EmailVerification.prototype.verify = async function () {
  this.tokenValidation(this.token);

  if (!this.tokenValidationResult.isValid) return this.tokenValidationResult;

  const statusAccount = await this.isActive();

  if (statusAccount === 1) {
    this.tokenValidationResult.accountActive = true;
    return this.tokenValidationResult;
  }

  const emailVerificationModel = new EmailVerificationModel(true, this.tokenValidationResult.payload);
  await emailVerificationModel.update();

  return this.tokenValidationResult;
};

EmailVerification.prototype.isActive = async function () {
  if (this.tokenValidationResult.payload === null) return false;

  const findUser = new FindUser(this.tokenValidationResult.payload.userId);
  const user = await findUser.find();

  return user.is_active;
};

EmailVerification.prototype.tokenValidation = function () {
  try {
    const decoded = jwt.verify(this.token, process.env.SECRET_KEY);
    this.tokenValidationResult.isValid = true;
    this.tokenValidationResult.payload = decoded;
  } catch (error) {
    this.tokenValidationResult.error = 'Invalid or expired token!';
  }

  return this.tokenValidationResult;
};

module.exports = EmailVerification;
