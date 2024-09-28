const Database = require('../../config/Database');

function SearchByCategory(category) {
  Database.call(this);

  this.category = category;
}

SearchByCategory.prototype = Object.create(Database.prototype);

SearchByCategory.prototype.search = async function () {
  const connection = await this.openConnection();
  try {
    const sql = 'SELECT * FROM products WHERE category = ?';
    const [rows] = await connection.execute(sql, [this.category]);
    if (!rows.length > 0) {
      return false;
    } else {
      return rows;
    }
  } catch (error) {
    throw new Error(`DATABASE ERROR: ${error.message}`);
  } finally {
    this.releaseConnection(connection);
  }
};

module.exports = SearchByCategory;
