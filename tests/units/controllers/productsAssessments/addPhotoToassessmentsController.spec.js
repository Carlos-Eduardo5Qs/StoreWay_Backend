const AddPhotoToAssessmentsService = require('../../../../src/services/productsAssessments/AddPhotoToAssessmentsService');
const { addPhoto } = require('../../../../src/controllers/productsAssessments/addPhotoToAssessmentsController');

jest.mock('../../../../src/services/productsAssessments/AddPhotoToAssessmentsService');

describe('addPhotoToAssessmentsController', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            body: {
                avaliation: '1234',
            },
            file: { path: 'fakePath/to/photo.jpg' },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.clearAllMocks();
    });

    it('Should return 500 if an error e thrown', async () => {
        const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => { });

        AddPhotoToAssessmentsService.mockImplementation(() => {
            return {
                addPhoto: jest.fn().mockRejectedValue(new Error('Simulated Error')),
            };
        });

        await addPhoto(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ data: { message: 'Internal Server Error' } });
        expect(console.error).toHaveBeenCalledWith('Simulated Error');

        consoleErrorMock.mockRestore();
    });

    it('Should return 200 if the photo is added successfully', async () => {
        AddPhotoToAssessmentsService.mockImplementation(() => {
          return {
            addPhoto: jest.fn().mockResolvedValue(true),
          };
        });
    
        await addPhoto(req, res);
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ data: { message: 'The image has been added to the assessment.'} });
    });
});
