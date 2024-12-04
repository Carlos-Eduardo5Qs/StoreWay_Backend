const Database = require('../../config/Database');

function CreateCategory(name) {
  Database.call(this);

  this.name = name;
}

CreateCategory.prototype = Object.create(Database.prototype);

CreateCategory.prototype.create = async function () {
  const connection = await this.openConnection();

  try {
    const sql = 'INSERT INTO categories (name) VALUES(?)';
    const [result] = await connection.execute(sql, [this.name]);

    if (result.affectedRows > 0) {
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

module.exports = CreateCategory;
