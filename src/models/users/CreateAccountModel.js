const Database = require('../../config/Database');

function RegisterAccount(account) {
  Database.call(this);

  this.account = account.map((value) => (value !== undefined ? value : null));

  this.init();
}

RegisterAccount.prototype = Object.create(Database.prototype);

RegisterAccount.prototype.init = function () {
  this.register();
};

RegisterAccount.prototype.register = async function () {
  const connection = await this.openConnection();
  try {
    const sql = 'INSERT INTO user_profile (nick, user_name, email, password_) VALUES (?,?,?,?)';
    await connection.execute(sql, this.account);
  } catch (error) {
    throw new Error(`DATABASE ERROR: ${error.message}`);
  } finally {
    this.releaseConnection(connection);
  }
};

module.exports = RegisterAccount;
