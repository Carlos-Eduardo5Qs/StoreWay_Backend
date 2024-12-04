const Database = require('../../config/Database');

function CheckCategoryExists(name) {
  Database.call(this);

  this.name = name;
}

CheckCategoryExists.prototype = Object.create(Database.prototype);

CheckCategoryExists.prototype.check = async function () {
  const connection = await this.openConnection();

  try {
    const sql = 'SELECT * FROM categories WHERE name = ?';
    const [rows] = await connection.execute(sql, [this.name]);

    if (rows.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error(`DATABASE ERROR: ${error.message}`);
  } finally {
    this.releaseConnection(connection);
  }
};

module.exports = CheckCategoryExists;
