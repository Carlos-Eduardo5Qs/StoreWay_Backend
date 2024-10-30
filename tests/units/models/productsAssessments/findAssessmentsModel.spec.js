const FindAssessment = require('../../../../src/models/productsAssessments/FindAssessmentModel');
const Database = require('../../../../src/config/Database');

jest.mock('../../../../src/config/Database');

describe('FindAssessment Model', () => {
    let findAssessment;
    let mockConnection;
  
    beforeEach(() => {
      mockConnection = {
        execute: jest.fn(),
      };
  
      Database.prototype.openConnection = jest.fn().mockResolvedValue(mockConnection);
      Database.prototype.releaseConnection = jest.fn();
      
      findAssessment = new FindAssessment(1);
    });
  
    it('should call execute with correct SQL and parameters', async () => {
      mockConnection.execute.mockResolvedValue([[{ id: 1, review: 'Good product', stars: 4 }]]);
      
      await findAssessment.find();
  
      expect(mockConnection.execute).toHaveBeenCalledWith(
        'SELECT * FROM avaliation WHERE id = ?',
        [1]
      );
    });
  
    it('should return the first row if assessment is found', async () => {
      const mockResult = [{ id: 1, review: 'Good product', stars: 4 }];
      mockConnection.execute.mockResolvedValue([mockResult]);
  
      const result = await findAssessment.find();
  
      expect(result).toEqual(mockResult[0]);
    });
  
    it('should return an empty object if no assessment is found', async () => {
      mockConnection.execute.mockResolvedValue([[]]);
  
      const result = await findAssessment.find();
  
      expect(result).toEqual({});
    });
  
    it('should release the connection after executing the query', async () => {
      mockConnection.execute.mockResolvedValue([[]]);
  
      await findAssessment.find();
  
      expect(Database.prototype.releaseConnection).toHaveBeenCalledWith(mockConnection);
    });
  
    it('should throw an error if execute fails', async () => {
      mockConnection.execute.mockRejectedValue(new Error('Mocked database error'));
  
      await expect(findAssessment.find()).rejects.toThrow('DATABASE ERROR: Mocked database error');
    });
  });
