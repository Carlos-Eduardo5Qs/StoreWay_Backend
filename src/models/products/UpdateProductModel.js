const Database = require('../../config/Database');

function UpdateProduct(product) {
  Database.call(this);
  this.product = product;
}

UpdateProduct.prototype = Object.create(Database.prototype);

UpdateProduct.prototype.update = async function () {
  const connection = await this.openConnection();
  try {
    const sql = 'UPDATE products SET name = ?, image = ?, image_id = ?, image_filename = ?, description = ?, price = ?, category_id = ?, brand = ?, stock = ? WHERE id = ?';
    const [result] = await connection.execute(sql, this.product);

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

module.exports = UpdateProduct;
