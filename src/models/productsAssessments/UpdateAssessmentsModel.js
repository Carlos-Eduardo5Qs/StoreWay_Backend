const Database = require('../../config/Database');

function UpdateComentsModel(assessmentId, review, stars) {
  Database.call(this);

  this.assessmentId = assessmentId;
  this.review = review;
  this.stars = stars;
}

UpdateComentsModel.prototype = Object.create(Database.prototype);

UpdateComentsModel.prototype.update = async function () {
  const connection = await this.openConnection();
  try {
    const sql = 'UPDATE avaliation SET review = ?, stars = ? WHERE id = ?';
    await connection.execute(sql, [this.review, this.stars, this.assessmentId]);
  } catch (error) {
    throw new Error(`DATABASE ERROR: ${error.message}`);
  } finally {
    this.releaseConnection(connection);
  }
};

module.exports = UpdateComentsModel;
