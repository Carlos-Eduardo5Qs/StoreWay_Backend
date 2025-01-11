require('dotenv').config();

const jwt = require('jsonwebtoken');

const EmailVerificationModel = require('../../models/users/EmailVerificationModel');
const FindUser = require('../../models/users/FindUserModel');

function EmailVerification(token) {
  this.token = token;
  this.results = {
    error: null,
    tokenIsValid: false,
    payload: null,
    accountActive: false,
  };
  this.accountActive = false;
}

EmailVerification.prototype.verify = async function () {
  this.tokenValidation(this.token);

  if (!this.results.tokenIsValid) return this.results;

  const statusAccount = await this.isActive();

  if (this.results.error) {
    return this.results;
  }

  if (statusAccount === 1) {
    this.results.accountActive = true;
    return this.results;
  }

  const emailVerificationModel = new EmailVerificationModel(true, this.results.payload);
  await emailVerificationModel.update();

  return this.results;
};

EmailVerification.prototype.isActive = async function () {
  if (!this.results.payload) {
    this.results.error = 'Invalid token payload!';
    return false;
  }

  const findUser = new FindUser(this.results.payload.userId);
  const user = await findUser.find();

  if (!user) {
    this.results.error = 'User not found!';
    return false;
  }

  return user.is_active;
};

EmailVerification.prototype.tokenValidation = function () {
  try {
    const decoded = jwt.verify(this.token, process.env.SECRET_KEY);
    this.results.tokenIsValid = true;
    this.results.payload = decoded;
  } catch (error) {
    this.results.error = 'Invalid or expired token!';
  }

  return this.results;
};

module.exports = EmailVerification;
