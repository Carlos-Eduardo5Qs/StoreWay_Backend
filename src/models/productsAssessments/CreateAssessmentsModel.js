const Database = require('../../config/Database');

function CreateAssessment(productId, userId, text, stars) {
  Database.call(this);

  this.productId = productId;
  this.userId = userId;
  this.text = text;
  this.stars = stars;
}

CreateAssessment.prototype = Object.create(Database.prototype);

CreateAssessment.prototype.create = async function () {
  const connection = await this.openConnection();

  try {
    const sql = 'INSERT INTO avaliation (user_id, product_id, review, stars) VALUES (?, ?, ?, ?)';
    await connection.execute(sql, [this.userId, this.productId, this.text, this.stars]);
  } catch (error) {
    throw new Error(`DATABASE ERROR: ${error.message}`);
  } finally {
    this.releaseConnection(connection);
  }
};

module.exports = CreateAssessment;
