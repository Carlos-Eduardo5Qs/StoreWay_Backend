const Database = require('../../config/Database');

function RegisterProduct(product) {
  Database.call(this);

  this.product = product;
}

RegisterProduct.prototype = Object.create(Database.prototype);

RegisterProduct.prototype.register = async function () {
  const connection = await this.openConnection();
  try {
    const sql = 'INSERT INTO products (name, image, image_id, image_filename, description, price, category, brand, stock) VALUES(?,?,?,?,?,?,?,?,?)';
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

module.exports = RegisterProduct;
