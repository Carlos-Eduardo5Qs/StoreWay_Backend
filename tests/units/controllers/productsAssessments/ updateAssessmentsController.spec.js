const jwt = require('jsonwebtoken');
const UpdateAssessemtsService = require('../../../../src/services/productsAssessments/UpdateAssessmentsService');
const { updateAssessemts } = require('../../../../src/controllers/productsAssessments/updateAssessmentsController');

jest.mock('../../../../src/services/productsAssessments/UpdateAssessmentsService');
jest.mock('jsonwebtoken');

describe('updateAssessemtsController', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {
        id: 'review123',
        review: 'Updated review content',
        stars: 4,
      },
      headers: {
        authorization: 'mockedToken',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  it('Should return 400 if required fields are missing', async () => {
    req.body.id = '';
    jwt.verify.mockReturnValue({ id: 'user123' });

    await updateAssessemts(req, res);

    expect(res.json).toHaveBeenCalledWith({ data: { message: 'Unable to update comment.' } });
  });

  it('Should return 403 if access is denied', async () => {
    jwt.verify.mockReturnValue({ id: 'user123' });
    UpdateAssessemtsService.mockImplementation(() => {
      return {
        checkUser: jest.fn().mockResolvedValue('Access denied.'),
      };
    });

    await updateAssessemts(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ data: { message: 'Access Denied.' } });
  });

  it('Should return 500 if an error is thrown', async () => {
    jwt.verify.mockReturnValue({ id: 'user123' });
    UpdateAssessemtsService.mockImplementation(() => {
      return {
        checkUser: jest.fn().mockRejectedValue(new Error('Simulated Error')),
      };
    });

    await updateAssessemts(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ data: { message: 'Internal Server Error.' } });
  });

  it('Should return 200 if the comment is updated successfully', async () => {
    jwt.verify.mockReturnValue({ id: 'user123' });
    UpdateAssessemtsService.mockImplementation(() => {
      return {
        checkUser: jest.fn().mockResolvedValue(true),
      };
    });

    await updateAssessemts(req, res);

    expect(res.json).toHaveBeenCalledWith({ data: { message: 'Updated commentary.' } });
  });
});
