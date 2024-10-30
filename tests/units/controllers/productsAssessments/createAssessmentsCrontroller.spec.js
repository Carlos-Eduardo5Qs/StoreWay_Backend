const jwt = require('jsonwebtoken');
const CreateAssessments = require('../../../../src/services/productsAssessments/CreateAssessmentsService');
const { assessment } = require('../../../../src/controllers/productsAssessments/createAssessmentsController');

jest.mock('../../../../src/services/productsAssessments/CreateAssessmentsService');
jest.mock('jsonwebtoken');

describe('assessmentController', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            body: {
                productId: '1234',
                text: 'This is a great product!',
                starts: 5,
            },
            headers: {
                authorization: 'mockedToken',
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.clearAllMocks();
    });

    it('Should return 400 if required fields are missing', async () => {
        req.body.productId = '';
        jwt.verify.mockReturnValue({ id: '1234' });

        await assessment(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ data: { message: 'Unable to create an assessment.' } });
    });

    it('Should return 500 if there is an error in the service', async () => {
        jwt.verify.mockReturnValue({ id: 'user123' });
        CreateAssessments.mockImplementation(() => {
            return {
                create: jest.fn().mockRejectedValue(new Error('Simulated Error')),
            };
        });

        const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => { });

        await assessment(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ data: { message: 'Internal Server Error.' } });
        expect(console.error).toHaveBeenCalledWith('Simulated Error');

        consoleErrorMock.mockRestore();
    });

    it('Should return 200 if the assessment is created successfully', async () => {
        jwt.verify.mockReturnValue({ id: 'user123' });
        CreateAssessments.mockImplementation(() => {
            return {
                create: jest.fn().mockResolvedValue(true),
            };
        });

        await assessment(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ data: { message: 'Comment created' } });
    });
});