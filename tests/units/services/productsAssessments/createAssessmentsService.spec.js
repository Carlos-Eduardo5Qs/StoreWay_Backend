const CreateAssessments = require('../../../../src/services/productsAssessments/CreateAssessmentsService');
const CreateAssessmentModel = require('../../../../src/models/productsAssessments/CreateAssessmentsModel');

jest.mock('../../../../src/models/productsAssessments/CreateAssessmentsModel');

describe('CreateAssessments Service', () => {
  let createAssessmentsService;

  beforeEach(() => {
    createAssessmentsService = new CreateAssessments(1, 2, 'Great product!', 5);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('must call the template to create a new evaluation with the correct arguments', async () => {
    const createMock = jest.fn().mockResolvedValue(true);
    CreateAssessmentModel.mockImplementation(() => ({
      create: createMock,
    }));

    await createAssessmentsService.create();

    expect(CreateAssessmentModel).toHaveBeenCalledWith(1, 2, 'Great product!', 5);

    expect(createMock).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if the model fails to create the assessment', async () => {
    const createMock = jest.fn().mockRejectedValue(new Error('Database error'));
    CreateAssessmentModel.mockImplementation(() => ({
      create: createMock,
    }));

    await expect(createAssessmentsService.create()).rejects.toThrow('Database error');

    expect(CreateAssessmentModel).toHaveBeenCalledWith(1, 2, 'Great product!', 5);

    expect(createMock).toHaveBeenCalledTimes(1);
  });
});
