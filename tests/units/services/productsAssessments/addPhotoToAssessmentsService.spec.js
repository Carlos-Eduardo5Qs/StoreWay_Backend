const AddPhotoToAssessments = require('../../../../src/services/productsAssessments/AddPhotoToAssessmentsService');
const AddPhotoToAssessmentsModel = require('../../../../src/models/productsAssessments/AddPhotoToAssessmentsModel');
const B2 = require('backblaze-b2');

jest.mock('../../../../src/models/productsAssessments/AddPhotoToAssessmentsModel');
jest.mock('backblaze-b2');

describe('AddPhotoToAssessments Service', () => {
  let addPhotoService;
  let mockB2Instance;

  beforeEach(() => {
    mockB2Instance = {
      authorize: jest.fn().mockResolvedValue({
        data: { downloadUrl: 'https://example-b2.com' },
      }),
      getUploadUrl: jest.fn().mockResolvedValue({
        data: {
          uploadUrl: 'https://upload-b2.com',
          authorizationToken: 'mockAuthToken',
        },
      }),
      uploadFile: jest.fn().mockResolvedValue({
        data: { fileId: 'mockFileId', fileName: 'mockFileName' },
      }),
    };
    B2.mockImplementation(() => mockB2Instance);

    addPhotoService = new AddPhotoToAssessments(1, {
      originalname: 'test-image.jpg',
      buffer: Buffer.from('fake image data'),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should upload the image and save the URL in the template', async () => {
    const addMock = jest.fn().mockResolvedValue(true);
    AddPhotoToAssessmentsModel.mockImplementation(() => ({
      add: addMock,
    }));

    await addPhotoService.addPhoto();

    expect(mockB2Instance.authorize).toHaveBeenCalledTimes(1);
    expect(mockB2Instance.getUploadUrl).toHaveBeenCalledWith({ bucketId: process.env.BUCKET_ID });
    expect(mockB2Instance.uploadFile).toHaveBeenCalledWith({
      uploadUrl: 'https://upload-b2.com',
      uploadAuthToken: 'mockAuthToken',
      fileName: 'PhotoAssessment/test-image.jpg',
      data: Buffer.from('fake image data'),
    });

    expect(AddPhotoToAssessmentsModel).toHaveBeenCalledWith(
      1,
      'https://example-b2.com/file/' + process.env.BUCKET_NAME + '/PhotoAssessment/test-image.jpg',
      'mockFileId',
      'mockFileName'
    );
    expect(addMock).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if the upload fails', async () => {
    mockB2Instance.uploadFile.mockRejectedValue(new Error('Upload failed'));

    await expect(addPhotoService.addPhoto()).rejects.toThrow('Upload failed');

    expect(AddPhotoToAssessmentsModel).not.toHaveBeenCalled();
  });

  it('should throw an error if authorization with B2 fails', async () => {
    mockB2Instance.authorize.mockRejectedValue(new Error('Authorization failed'));

    await expect(addPhotoService.addPhoto()).rejects.toThrow('Authorization failed');

    expect(mockB2Instance.getUploadUrl).not.toHaveBeenCalled();
    expect(mockB2Instance.uploadFile).not.toHaveBeenCalled();
    expect(AddPhotoToAssessmentsModel).not.toHaveBeenCalled();
  });
});
