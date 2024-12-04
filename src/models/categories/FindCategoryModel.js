const Database = require('../../config/Database');

function FindCategory(name) {
  Database.call(this);

  this.name = name;
}

FindCategory.prototype = Object.create(Database.prototype);

FindCategory.prototype.find = async function () {
  const connection = await this.openConnection();

  try {
    const sql = 'SELECT * FROM categories WHERE name = ?';
    const [rows] = await connection.execute(sql, [this.name]);

    if (rows.length > 0) {
      return rows[0];
    } else {
      return null;
    }
  } catch (error) {
    throw new Error(`DATABASE ERROR: ${error.message}`);
  } finally {
    this.releaseConnection(connection);
  }
};

module.exports = FindCategory;
