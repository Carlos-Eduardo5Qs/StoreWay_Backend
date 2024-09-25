const StartServer = require('../../index');

describe('Environment variables', () => {
  let testInstance;

  beforeEach(() => {
    testInstance = new StartServer();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Environment variables should not generate new error', () => {
    expect(() => testInstance.checkEnvironmentVariables()).not.toThrow();
  });

  it('Environment variables should throw new error', () => {
    jest.spyOn(testInstance, 'checkEnvironmentVariables').mockImplementation(() => {
      const environmentVariables = {
        port: undefined,
      };

      const keys = Object.keys(environmentVariables);

      for (let i = 0; i < keys.length; i += 1) {
        if (!environmentVariables[keys[i]]) {
          throw new Error('Error simulation.');
        }
      }
    });

    expect(() => testInstance.checkEnvironmentVariables()).toThrow('Error simulation.');
  });
});
