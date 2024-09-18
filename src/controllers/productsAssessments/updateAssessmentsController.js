require('dotenv').config();
const jwt = require('jsonwebtoken');

const UpdateAssessemtsService = require('../../services/productsAssessments/UpdateAssessmentsService');

exports.updateAssessemts = async (req, res) => {
  try {
    const {
      id, review, stars,
    } = req.body;

    const { authorization } = req.headers;
    const decoded = jwt.verify(authorization, process.env.SECRET_KEY);
    const userId = decoded.id;

    if (!id || !review || !stars || !userId) return res.json({ data: { message: 'Unable to update comment.' } });

    const updateAssessemtsService = new UpdateAssessemtsService(id, review, stars, userId);
    const update = await updateAssessemtsService.checkUser();

    if (update === 'Access denied.') return res.status(403).json({ data: { message: 'Access Denied.' } });
  } catch (error) {
    res.status(500).json({ data: { message: 'Internal Server Error.' } });
  }
  res.json({ data: { message: 'Updated commentary.' } });
};
