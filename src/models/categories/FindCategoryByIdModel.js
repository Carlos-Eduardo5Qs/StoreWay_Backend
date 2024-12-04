const Database = require('../../config/Database');

function FindCategoryById(id) {
  Database.call(this);

  this.id = id;
}

FindCategoryById.prototype = Object.create(Database.prototype);

FindCategoryById.prototype.find = async function () {
  const connection = await this.openConnection();

  try {
    const sql = 'SELECT * FROM categories WHERE id = ?';
    const [rows] = await connection.execute(sql, [this.id]);

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

module.exports = FindCategoryById;
