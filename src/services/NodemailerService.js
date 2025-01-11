require('dotenv').config();

const nodemailer = require('nodemailer');

function Nodemailer(name, email, subject, body) {
  this.name = name;
  this.to = email;
  this.subject = subject;
  this.body = body;

  this.mailOptions = {
    from: process.env.MAIL_FROM,
    to: this.to,
    subject: this.subject,
    html: this.body,
  };

  this.init();
}

Nodemailer.prototype.init = function () {
  this.configureTransporter();
  this.send();
};

Nodemailer.prototype.configureTransporter = function () {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
  return transporter;
};

Nodemailer.prototype.send = async function () {
  await this.configureTransporter().sendMail(this.mailOptions);
};

module.exports = Nodemailer;
