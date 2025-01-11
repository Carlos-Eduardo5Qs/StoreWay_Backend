/* eslint-disable no-unused-vars */

require('dotenv').config();
const PasswordValidator = require('password-validator');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const RegisterAccount = require('../../models/users/CreateAccountModel');
const Nodemailer = require('../NodemailerService');
const generateNickname = require('../../utils/generateNickname');
const SearchUser = require('../../models/users/SearchUserModel');

function CreateAccount(name, email, password, confirmPassword) {
  this.name = name;
  this.email = email;
  this.password = password;
  this.confirmPassword = confirmPassword;

  this.init();
}

CreateAccount.prototype.init = function () {
  this.validateEmail();
  this.validadePassword();
  this.registerAccount();
};

CreateAccount.prototype.validateEmail = function () {
  if (!validator.isEmail(this.email)) {
    throw new Error('Invalid email');
  }
};

CreateAccount.prototype.validadePassword = function () {
  if (this.password === this.confirmPassword) {
    const schema = new PasswordValidator();

    schema
      .is().min(6)
      .is().max(100)
      .has()
      .uppercase()
      .has()
      .lowercase()
      .has()
      .digits();

    const validationResult = schema.validate(this.password);

    if (!validationResult) {
      throw new Error('Invalid password');
    }
  } else {
    throw new Error('Passwords must be the same.');
  }
};

CreateAccount.prototype.createPasswordHash = function (password) {
  const saltRounds = 14;

  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);

  return hash;
};

CreateAccount.prototype.registerAccount = function () {
  const account = [
    generateNickname(),
    this.name,
    this.email,
    this.createPasswordHash(this.password),
  ];

  const registerAccount = new RegisterAccount(account);

  const nodemailer = new Nodemailer(
    this.name,
    this.email,
    'Boas vindas',
    `
    <html lang="pt-br">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Boas Vindas</title>
      </head>
      <body>
        <p>Olá, ${this.name},</p>
        <p>É um prazer recebê-lo(a) como nosso cliente. Esperamos que tenha uma experiência incrível com os nossos serviços e produtos.</p>
        
        <p>Para validar o seu email, clique <a href="${this.generateValidationLink()}">aqui</a>.</p>
        
        <p>Este link é válido por 24 horas.</p>
      </body>
    </html>
    `,
  );
};

CreateAccount.prototype.generateValidationLink = async function () {
  const searchUser = new SearchUser(this.email);
  const user = await searchUser.find();

  const payload = {
    userId: user.id,
  };

  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '24h' });

  const link = `${process.env.BASE_URL}/users/email-verification/${token}`;
  console.log(link);
  return link;
};

module.exports = CreateAccount;
