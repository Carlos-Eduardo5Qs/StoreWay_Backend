const Verify = require('../../../../src/models/users/verifyAuthorizarionModel');
const Database = require('../../../../src/config/Database');

jest.mock('../../../../src/config/Database');

describe('Verify', () => {
    let verify;
    let mockConnection;
  
    beforeEach(() => {
      mockConnection = {
        execute: jest.fn().mockResolvedValue([[]]),
      };
  
      Database.prototype.openConnection = jest.fn().mockResolvedValue(mockConnection);
      Database.prototype.releaseConnection = jest.fn();
  
      verify = new Verify(1);
    });
  
    it('should call execute with correct SQL and parameters', async () => {
      await verify.isAdm();
  
      expect(mockConnection.execute).toHaveBeenCalledWith(
        'SELECT * FROM user_profile WHERE id = ?',
        [1]
      );
    });
  
    it('should return false if no user is found', async () => {
      const result = await verify.isAdm();
  
      expect(result).toBe(false);
    });
  
    it('should return true if the user has access_level "adm"', async () => {
      mockConnection.execute.mockResolvedValue([[{ access_level: 'adm' }]]);
  
      const result = await verify.isAdm();
  
      expect(result).toBe(true);
    });
  
    it('should return false if the user has access_level "client"', async () => {
      mockConnection.execute.mockResolvedValue([[{ access_level: 'client' }]]);
  
      const result = await verify.isAdm();
  
      expect(result).toBe(false);
    });
  
    it('should return false if the user does not exist in the database', async () => {
      mockConnection.execute.mockResolvedValue([[]]);
  
      const result = await verify.isAdm();
  
      expect(result).toBe(false);
    });
  
    it('should log an error if execute fails', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockConnection.execute.mockRejectedValue(new Error('Mocked database error'));
  
      await verify.isAdm();
  
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));
      consoleErrorSpy.mockRestore();
    });
  
    it('should release the connection after executing the query', async () => {
      await verify.isAdm();
  
      expect(Database.prototype.releaseConnection).toHaveBeenCalledWith(mockConnection);
    });
  });