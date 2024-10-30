const Database = require('../../config/Database');

function AddPhotoToAssessments(avaliationId, image, imageId, imageFilename) {
  Database.call(this);

  this.avaliationId = avaliationId;
  this.image = image;
  this.imageId = imageId;
  this.imageFilename = imageFilename;
}

AddPhotoToAssessments.prototype = Object.create(Database.prototype);

AddPhotoToAssessments.prototype.add = async function () {
  const connection = await this.openConnection();
  try {
    const sql = 'INSERT INTO photoAvaliation (avaliation_id, image, image_id, image_filename) VALUES (?, ?, ?, ?)';
    await connection.execute(sql, [this.avaliationId, this.image, this.imageId, this.imageFilename]);
  } catch (error) {
    throw new Error(`DATABASE ERROR: ${error.message}`);
  } finally {
    this.releaseConnection(connection);
  }
};

module.exports = AddPhotoToAssessments;
