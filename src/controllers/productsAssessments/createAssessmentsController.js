require('dotenv').config();
const jwt = require('jsonwebtoken');

const CreateAssessments = require('../../services/productsAssessments/CreateAssessmentsService');

exports.assessment = async (req, res) => {
  const {
    productId, text, stars,
  } = req.body;

  const { authorization } = req.headers;
  const decoded = jwt.verify(authorization, process.env.SECRET_KEY, { ignoreExpiration: true });
  const userId = decoded.id;

  if (!productId || !text || !userId) {
    return res.status(400).json({ data: { message: 'Unable to create an assessment.' } });
  }

  try {
    const createAssessment = new CreateAssessments(productId, userId, text, stars);
    await createAssessment.create();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ data: { message: 'Internal Server Error.' } });
  }

  res.status(200).json({ data: { message: 'Okay.' } });
};
