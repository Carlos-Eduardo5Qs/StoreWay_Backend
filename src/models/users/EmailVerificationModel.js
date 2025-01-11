const Database = require('../../config/Database');

function EmailVerificationModel(boolean, decoded) {
  Database.call(this);

  this.isActive = boolean;
  this.decoded = decoded;
}

EmailVerificationModel.prototype = Object.create(Database.prototype);

EmailVerificationModel.prototype.update = async function () {
  const connection = await this.openConnection();
  try {
    const sql = 'UPDATE user_profile SET is_active = ? WHERE id = ?';
    await connection.execute(sql, [this.isActive, this.decoded.userId]);
  } catch (error) {
    throw new Error(`DATABASE ERROR: ${error.message}`);
  } finally {
    this.releaseConnection(connection);
  }
};

module.exports = EmailVerificationModel;
