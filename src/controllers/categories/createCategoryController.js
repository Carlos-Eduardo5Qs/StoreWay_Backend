exports.create = async (req, res) => {
  try {
    const { name } = req.body;

    return res.status(200).json({ data: { message: 'Okay' } });
  } catch (error) {
    return res.status(500).json({ data: { message: 'An error occurres while creating category. Please try again later.' } });
  }
};
