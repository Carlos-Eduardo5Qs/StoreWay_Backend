require('dotenv').config();

const StartServer = require('../../index');

describe('Connection to the database', () => {
  let testInstance;

  beforeEach(() => {
    testInstance = new StartServer();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Connection to the database should not generate a new error', async () => {
    jest.spyOn(testInstance, 'openConnection').mockResolvedValue('Connection opened');
    jest.spyOn(testInstance, 'closeConnection').mockResolvedValue('Connection closed');

    await expect(testInstance.checkDatabaseConnection()).resolves.not.toThrow();

    expect(testInstance.openConnection).toHaveBeenCalled();
    expect(testInstance.closeConnection).toHaveBeenCalled();
  });

  it('Connection to the database should generate a new error', async () => {
    jest.spyOn(testInstance, 'openConnection').mockRejectedValue(new Error('Connection error'));
    jest.spyOn(testInstance, 'closeConnection').mockReturnValue('Connection closed');

    await expect(() => testInstance.checkDatabaseConnection()).rejects.toThrow('Connection error');

    expect(testInstance.openConnection).toHaveBeenCalled();
    expect(testInstance.closeConnection).not.toHaveBeenCalled();
  });
});