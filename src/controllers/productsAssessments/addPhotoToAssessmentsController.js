const AddPhotoToAssessmentsService = require('../../services/productsAssessments/AddPhotoToAssessmentsService');

exports.addPhoto = async (req, res) => {
  const { file } = req;
  const { avaliationId } = req.body;

  try {
    const addPhotoToAssessmentsService = new AddPhotoToAssessmentsService(avaliationId, file);
    await addPhotoToAssessmentsService.addPhoto();
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ data: { message: 'Internal Server Error' } });
  }

  res.status(200).json({ data: { message: 'The image has been added to the assessment.' } });
};
