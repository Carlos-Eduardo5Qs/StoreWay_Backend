require('dotenv').config();

const StartServer = require('../../index');

describe('Server startup', () => {
  let testInstance;

  beforeEach(() => {
    testInstance = new StartServer();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Must start the server and log expected messages', () => {
    jest.spyOn(console, 'log').mockImplementation(() => {});

    jest.spyOn(testInstance, 'startServerListening').mockImplementation(() => {
      console.log('Mocked server running');
      console.log(`Mocked Access: http://localhost:${process.env.SERVER_PORT}`);
    });

    testInstance.start();

    expect(testInstance.startServerListening).toHaveBeenCalledWith(process.env.SERVER_PORT);
  });

  it('The server should not start, it should generate a new error.', () => {
    jest.spyOn(testInstance, 'startServerListening').mockImplementation(() => {
      throw new Error('Error simulation.');
    });

    expect(() => testInstance.start()).toThrow('Error simulation.');
  });
});