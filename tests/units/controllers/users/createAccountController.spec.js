const CreateAccount = require('../../../../src/services/users/CreateAccountService');
const SearchUser = require('../../../../src/models/users/SearchUserModel');
const { createAccount } = require('../../../../src/controllers/users/createAccountController');

jest.mock('../../../../src/services/users/CreateAccountService');
jest.mock('../../../../src/models/users/SearchUserModel');

describe('createAccountController', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it('Should return 400 if any required field is missing', async () => {
    req.body.email = '';

    await createAccount(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ data: { message: 'All fields are mandatory.' } });
  });

  it('Should return 409 if user already exists', async () => {
    SearchUser.mockImplementation(() => {
      return {
        find: jest.fn().mockResolvedValue(true),
      };
    });

    await createAccount(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ data: { message: 'User already exists.' } });
  });

  it('Should return 200 if account is created successfully', async () => {
    SearchUser.mockImplementation(() => {
      return {
        find: jest.fn().mockResolvedValue(false),
      };
    });

    CreateAccount.mockImplementation(() => {
      return {
        create: jest.fn().mockResolvedValue(true),
      };
    });

    await createAccount(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Account created.',
      notice: 'Please ensure that the email address you provide is correct and accessible. This email is crucial for receiving important information related to your account.',
    });
  });

  it('Should return 401 if an error is thrown', async () => {
    const errorMessage = 'Simulated error';
    SearchUser.mockImplementation(() => {
      return {
        find: jest.fn().mockRejectedValue(new Error(errorMessage)),
      };
    });

    await createAccount(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      data: { message: errorMessage },
    });
  });
});
