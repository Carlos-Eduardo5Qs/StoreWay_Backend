const Database = require('../../config/Database');

function FindUser(id) {
  Database.call(this);

  this.id = id;
}

FindUser.prototype = Object.create(Database.prototype);

FindUser.prototype.find = async function () {
  const connection = await this.openConnection();
  try {
    const sql = 'SELECT * FROM user_profile WHERE id = ?';
    const [rows] = await connection.execute(sql, [this.id]);

    if (!rows.length > 0) {
      return {};
    } else {
      return rows[0];
    }
  } catch (error) {
    console.error(error);
  } finally {
    this.releaseConnection(connection);
  }
};

module.exports = FindUser;
