const Database = require('../../config/Database');

function FindAssessment(id) {
  Database.call(this);

  this.id = id;
}

FindAssessment.prototype = Object.create(Database.prototype);

FindAssessment.prototype.find = async function () {
  const connection = await this.openConnection();
  try {
    const sql = 'SELECT * FROM avaliation WHERE id = ?';
    const [rows] = await connection.execute(sql, [this.id]);

    if (!rows.length > 0) {
      return {};
    } else {
      return rows[0];
    }
  } catch (error) {
    throw new Error(`DATABASE ERROR: ${error.message}`);
  } finally {
    this.releaseConnection(connection);
  }
};

module.exports = FindAssessment;
