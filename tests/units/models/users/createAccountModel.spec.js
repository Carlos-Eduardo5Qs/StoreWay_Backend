const RegisterAccount = require('../../../../src/models/users/CreateAccountModel');
const Database = require('../../../../src/config/Database');

jest.mock('../../../../src/config/Database');

describe('RegisterAccount', () => {
  let registerAccount;
  let mockConnection;

  beforeEach(() => {
    mockConnection = {
      execute: jest.fn().mockResolvedValue(),
    };

    Database.prototype.openConnection = jest.fn().mockResolvedValue(mockConnection);
    Database.prototype.releaseConnection = jest.fn();

    const account = ['testNick', 'testUser', 'test@example.com', 'password123'];
    registerAccount = new RegisterAccount(account);
  });

  it('should call execute with correct SQL and parameters', async () => {
    await registerAccount.register();

    expect(mockConnection.execute).toHaveBeenCalledWith(
      'INSERT INTO user_profile (nick, user_name, email, password_) VALUES (?,?,?,?)',
      ['testNick', 'testUser', 'test@example.com', 'password123']
    );
  });

  it('should release the connection after executing the query', async () => {
    await registerAccount.register();

    expect(Database.prototype.releaseConnection).toHaveBeenCalledWith(mockConnection);
  });

  it('should throw an error if execute fails', async () => {
    mockConnection.execute.mockRejectedValue(new Error('Mocked database error'));

    await expect(registerAccount.register()).rejects.toThrow('DATABASE ERROR: Mocked database error');
  });

  it('should map undefined values to null in the account array', async () => {
    const accountWithUndefined = ['testNick', undefined, 'test@example.com', 'password123'];
    registerAccount = new RegisterAccount(accountWithUndefined);
    await registerAccount.register();

    expect(mockConnection.execute).toHaveBeenCalledWith(
      'INSERT INTO user_profile (nick, user_name, email, password_) VALUES (?,?,?,?)',
      ['testNick', null, 'test@example.com', 'password123']
    );
  });
});