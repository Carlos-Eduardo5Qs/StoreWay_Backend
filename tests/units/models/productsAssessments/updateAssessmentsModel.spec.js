const UpdateComentsModel = require('../../../../src/models/productsAssessments/UpdateAssessmentsModel');
const Database = require('../../../../src/config/Database');

jest.mock('../../../../src/config/Database');

describe('UpdateComentsModel', () => {
    let updateComentsModel;
    let mockConnection;
  
    beforeEach(() => {
      mockConnection = {
        execute: jest.fn().mockResolvedValue(),
      };
  
      Database.prototype.openConnection = jest.fn().mockResolvedValue(mockConnection);
      Database.prototype.releaseConnection = jest.fn();
  
      updateComentsModel = new UpdateComentsModel(1, 'Updated review', 4);
    });
  
    it('should call execute with correct SQL and parameters', async () => {
      await updateComentsModel.update();
  
      expect(mockConnection.execute).toHaveBeenCalledWith(
        'UPDATE avaliation SET review = ?, stars = ? WHERE id = ?',
        ['Updated review', 4, 1]
      );
    });
  
    it('should release the connection after executing the query', async () => {
      await updateComentsModel.update();
  
      expect(Database.prototype.releaseConnection).toHaveBeenCalledWith(mockConnection);
    });
  
    it('should throw an error if execute fails', async () => {
      mockConnection.execute.mockRejectedValue(new Error('Mocked database error'));
  
      await expect(updateComentsModel.update()).rejects.toThrow('DATABASE ERROR: Mocked database error');
    });
  });
