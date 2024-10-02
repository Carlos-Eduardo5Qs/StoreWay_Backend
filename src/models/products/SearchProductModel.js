const Database = require('../../config/Database');

function SearchProduct(id) {
  Database.call(this);

  this.id = id;
}

SearchProduct.prototype = Object.create(Database.prototype);

SearchProduct.prototype.find = async function () {
  const connection = await this.openConnection();
  try {
    const sql = 'SELECT * FROM products WHERE id = ?';
    const [rows] = await connection.execute(sql, [this.id]);
    if (!rows.length > 0) {
      return false;
    } else {
      return rows[0];
    }
  } catch (error) {
    throw new Error(`DATABASE ERROR: ${error.message}`);
  } finally {
    this.releaseConnection(connection);
  }
};

module.exports = SearchProduct;
