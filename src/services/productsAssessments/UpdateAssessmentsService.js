const UpdateAssessemtsModel = require('../../models/productsAssessments/UpdateAssessmentsModel');
const FindUserModel = require('../../models/users/FindUserModel');
const FindAssessmentModel = require('../../models/productsAssessments/FindAssessmentModel');

function UpdateAssessemts(assessmentId, review, stars, userId) {
  this.assessmentId = assessmentId;
  this.review = review;
  this.stars = stars;
  this.userId = userId;
}

UpdateAssessemts.prototype.checkUser = async function () {
  const findUser = new FindUserModel(this.userId);
  const findAssessment = new FindAssessmentModel(this.assessmentId);
  const user = await findUser.find();
  const assessment = await findAssessment.find();

  if (user.id === assessment.user_id) {
    this.update();
  } else {
    return 'Access denied.';
  }
};

UpdateAssessemts.prototype.update = async function () {
  const updateAssessemtsModel = new UpdateAssessemtsModel(this.assessmentId, this.review, this.stars, this.userId);
  await updateAssessemtsModel.update();
};

module.exports = UpdateAssessemts;
