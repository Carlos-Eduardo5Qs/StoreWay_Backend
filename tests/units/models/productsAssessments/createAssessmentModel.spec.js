const CreateAssessment  = require('../../../../src/models/productsAssessments/CreateAssessmentsModel');
const Database = require('../../../../src/config/Database');

jest.mock('../../../../src/config/Database');

describe('CreateAssessment Model', () => {
    let createAssessment;
    let mockConnection;
  
    beforeEach(() => {
      mockConnection = {
        execute: jest.fn().mockResolvedValue(),
      };
      
      Database.prototype.openConnection = jest.fn().mockResolvedValue(mockConnection);
      Database.prototype.releaseConnection = jest.fn();
      
      createAssessment = new CreateAssessment(1, 2, 'Great product!', 5);
    });
  
    it('should call execute with correct SQL and parameters', async () => {
      await createAssessment.create();
  
      expect(mockConnection.execute).toHaveBeenCalledWith(
        'INSERT INTO avaliation (user_id, product_id, review, stars) VALUES (?, ?, ?, ?)',
        [2, 1, 'Great product!', 5]
      );
    });
  
    it('should release the connection after executing the query', async () => {
      await createAssessment.create();
  
      expect(Database.prototype.releaseConnection).toHaveBeenCalledWith(mockConnection);
    });
  
    it('should throw an error if execute fails', async () => {
      mockConnection.execute.mockRejectedValue(new Error('Mocked database error'));
  
      await expect(createAssessment.create()).rejects.toThrow('DATABASE ERROR: Mocked database error');
    });
  });
