const Database = require('../../config/Database');

function DeleteProduct(id) {
  Database.call(this);
  this.id = id;
}

DeleteProduct.prototype = Object.create(Database.prototype);

DeleteProduct.prototype.delete = async function () {
  const connection = await this.openConnection();
  try {
    const sql = 'DELETE FROM products WHERE id = ?';
    await connection.execute(sql, [this.id]);
  } catch (error) {
    throw new Error(`DATABASE ERROR: ${error.message}`);
  } finally {
    this.releaseConnection(connection);
  }
};

module.exports = DeleteProduct;
