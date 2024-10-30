const AddPhotoToAssessments = require('../../../../src/models/productsAssessments/AddPhotoToAssessmentsModel');
const Database = require('../../../../src/config/Database');

jest.mock('../../../../src/config/Database');

describe('AddPhotoToAssessments', () => {
    let addPhotoToAssessments;
    let mockConnection;
  
    beforeEach(() => {
      mockConnection = {
        execute: jest.fn().mockResolvedValue(),
      };
      
      Database.prototype.openConnection = jest.fn().mockResolvedValue(mockConnection);
      Database.prototype.releaseConnection = jest.fn();
      
      addPhotoToAssessments = new AddPhotoToAssessments(1, 'imageData', 'img123', 'image.jpg');
    });
  
    it('should call execute with correct SQL and parameters', async () => {
      await addPhotoToAssessments.add();
  
      expect(mockConnection.execute).toHaveBeenCalledWith(
        'INSERT INTO photoAvaliation (avaliation_id, image, image_id, image_filename) VALUES (?, ?, ?, ?)',
        [1, 'imageData', 'img123', 'image.jpg']
      );
    });
  
    it('should release the connection after executing the query', async () => {
      await addPhotoToAssessments.add();
  
      expect(Database.prototype.releaseConnection).toHaveBeenCalledWith(mockConnection);
    });
  
    it('should throw an error if execute fails', async () => {
      mockConnection.execute.mockRejectedValue(new Error('Mocked database error'));
  
      await expect(addPhotoToAssessments.add()).rejects.toThrow('DATABASE ERROR: Mocked database error');
    });
  });
