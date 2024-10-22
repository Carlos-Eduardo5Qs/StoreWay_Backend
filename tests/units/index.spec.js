require('dotenv').config();
const StartServer = require('../../index');
const Database = require('../../src/config/Database');
const app = require('../../src/config/setupServer');

jest.mock('../../src/config/setupServer', () => ({
  listen: jest.fn((port, callback) => {
    callback();
  }),
}));

describe('StartServer', () => {
  let testInstance;

  beforeEach(() => {
    testInstance = new StartServer();

    delete process.env.SERVER_PORT;
    delete process.env.DATABASE_HOST;
    delete process.env.DATABASE_USER;
    delete process.env.DATABASE_PASSWORD;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize the server successfully', async () => {
    jest.spyOn(testInstance, 'checkEnvironmentVariables').mockImplementation(() => {});
    jest.spyOn(testInstance, 'checkDatabaseConnection').mockResolvedValue();
    jest.spyOn(testInstance, 'start').mockImplementation(() => {});

    await testInstance.init();

    expect(testInstance.checkEnvironmentVariables).toHaveBeenCalled();
    expect(testInstance.checkDatabaseConnection).toHaveBeenCalled();
    expect(testInstance.start).toHaveBeenCalled();
  });

  it('should log an error and exit if initialization fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const originalExit = process.exit;
    process.exit = jest.fn();

    jest.spyOn(testInstance, 'checkEnvironmentVariables').mockImplementation(() => {
      throw new Error('Test: Missing environment variable');
    });

    await testInstance.init();

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(process.exit).toHaveBeenCalledWith(1);

    process.exit = originalExit;
  });

  it('should not throw an error if all environment variables are present', () => {
    process.env.SERVER_PORT = '3000';
    process.env.DATABASE_HOST = 'localhost';
    process.env.DATABASE_USER = 'root';
    process.env.DATABASE_PASSWORD = 'password';

    expect(() => testInstance.checkEnvironmentVariables()).not.toThrow();
  });

  it('should throw an error if database connection fails', async () => {
    jest.spyOn(Database.prototype, 'openConnection').mockImplementation(() => {
      throw new Error('Database connection failed');
    });

    await expect(testInstance.checkDatabaseConnection()).rejects.toThrow('Database connection failed');
  });

  it('should successfully connect and close the database connection', async () => {
    jest.spyOn(Database.prototype, 'openConnection').mockImplementation(() => Promise.resolve());
    jest.spyOn(Database.prototype, 'closeConnection').mockImplementation(() => Promise.resolve());

    await expect(testInstance.checkDatabaseConnection()).resolves.not.toThrow();
  });

  it('should start the server and call startServerListening', () => {
    jest.spyOn(testInstance, 'startServerListening').mockImplementation(() => {});

    testInstance.start();

    expect(testInstance.startServerListening).toHaveBeenCalledWith(process.env.SERVER_PORT);
  });

  it('should listen on the specified port', () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const port = process.env.SERVER_PORT || 3000;

    testInstance.startServerListening(port);

    expect(consoleLogSpy).toHaveBeenCalledWith('Server running');
    expect(consoleLogSpy).toHaveBeenCalledWith(`Access: http://localhost:${port}`);
  });

  it('should throw an error if email-related environment variables are missing', () => {
    delete process.env.MAIL_HOST;
    delete process.env.MAIL_PORT;
    delete process.env.MAIL_USER;
    delete process.env.MAIL_PASS;
    delete process.env.MAIL_FROM;
    delete process.env.SECRET_KEY;
    delete process.env.BUCKET_ID;
    delete process.env.BUCKET_NAME;
    delete process.env.APP_KEY;
    delete process.env.KEY_ID;
  
    expect(() => testInstance.checkEnvironmentVariables()).toThrow(
      'ENVIRONMENT VARIABLES ERROR: Make sure to check your environment variables (¬_¬ )'
    );
  });
});