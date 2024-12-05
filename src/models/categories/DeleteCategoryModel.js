const Database = require('../../config/Database');

function DeleteCategory(idCategory) {
  Database.call(this);

  this.id = idCategory;
}

DeleteCategory.prototype = Object.create(Database.prototype);

DeleteCategory.prototype.delete = async function () {
  const connection = await this.openConnection();

  try {
    const sql = 'DELETE FROM categories WHERE id = ?';
    const [result] = await connection.execute(sql, [this.id]);

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

module.exports = DeleteCategory;
