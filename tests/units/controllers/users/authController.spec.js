const AuthService = require('../../../../src/services/users/AuthService');
const { auth } = require('../../../../src/controllers/users/authController');

jest.mock('../../../../src/services/users/AuthService');

describe('authController', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it('Should return 400 if email or password is missing', async () => {
    req.body.email = '';

    await auth(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'All fields are mandatory.' });
  });

  it('Should return 200 and tokens if authentication is successful', async () => {
    const mockTokens = {
      accessToken: 'mockAccessToken',
      refreshToken: 'mockRefreshToken',
    };

    AuthService.mockImplementation(() => {
      return {
        init: jest.fn().mockResolvedValue(mockTokens),
      };
    });

    await auth(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: {
        accessToken: mockTokens.accessToken,
        refreshToken: mockTokens.refreshToken,
      },
    });
  });

  it('Should return 401 if authentication fails', async () => {
    AuthService.mockImplementation(() => {
      return {
        init: jest.fn().mockRejectedValue(new Error('Invalid credentials')),
      };
    });

    await auth(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      data: {
        message: 'Invalid credentials',
      },
    });
  });
});
