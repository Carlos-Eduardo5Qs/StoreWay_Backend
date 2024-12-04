const Database = require('../../config/Database');

function UpdateCategory(newName, idCategory) {
  Database.call(this);

  this.newName = newName;
  this.idCategory = idCategory;
}

UpdateCategory.prototype = Object.create(Database.prototype);

UpdateCategory.prototype.update = async function () {
  const connection = await this.openConnection();

  try {
    const sql = 'UPDATE categories SET name = ? WHERE id = ?';
    const [result] = await connection.execute(sql, [this.newName, this.idCategory]);

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

module.exports = UpdateCategory;
