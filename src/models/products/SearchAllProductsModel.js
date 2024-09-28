const Database = require('../../config/Database');

function SearchAllProducts() {
  Database.call(this);
}

SearchAllProducts.prototype = Object.create(Database.prototype);

SearchAllProducts.prototype.search = async function () {
  const connection = await this.openConnection();
  try {
    const sql = 'SELECT * FROM products';
    const [rows] = await connection.execute(sql);
    if (rows.length === 0) {
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

module.exports = SearchAllProducts;
