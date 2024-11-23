const AuthService = require('../../../../src/services/users/AuthService');
const SearchUser = require('../../../../src/models/users/SearchUserModel');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

jest.mock('../../../../src/models/users/SearchUserModel');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  const mockEmail = 'user@example.com';
  const mockPassword = 'Valid1Password';
  const mockUser = {
    id: 1,
    password_: '$2b$10$JXl/fkd1nYyJwv09d4c1uOJtF2m0q0E5.h.W9z6g0Cg/jkl1deuKy',
  };

  let authService;

  beforeEach(() => {
    authService = new AuthService(mockEmail, mockPassword);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should validate email and password, then generate a token if valid', async () => {
    SearchUser.mockImplementation(() => ({
      find: jest.fn().mockResolvedValue(mockUser),
    }));

    bcrypt.compare.mockResolvedValue(true);

    jwt.sign.mockReturnValue('mockedAccessToken');

    const tokens = await authService.init();

    expect(tokens).toEqual({
      accessToken: 'mockedAccessToken',
      refreshToken: 'mockedAccessToken',
    });

    expect(SearchUser).toHaveBeenCalledWith(mockEmail);
    expect(bcrypt.compare).toHaveBeenCalledWith(mockPassword, mockUser.password_);
    expect(jwt.sign).toHaveBeenCalledTimes(2);
  });

  it('should throw an error if the email is invalid', async () => {
    const invalidEmailAuthService = new AuthService('invalidEmail', mockPassword);

    await expect(invalidEmailAuthService.init()).rejects.toThrow('Invalid email');
  });

  it('should throw an error if the password is invalid', async () => {
    const invalidPasswordAuthService = new AuthService(mockEmail, 'short');

    await expect(invalidPasswordAuthService.init()).rejects.toThrow('Invalid password');
  });

  it('should throw an error if user is not found', async () => {
    SearchUser.mockImplementation(() => ({
      find: jest.fn().mockResolvedValue(null),
    }));

    await expect(authService.init()).rejects.toThrow('User not found.');
  });

  it('should throw an error if the password is incorrect', async () => {
    SearchUser.mockImplementation(() => ({
      find: jest.fn().mockResolvedValue(mockUser),
    }));
    
    bcrypt.compare.mockResolvedValue(false);

    await expect(authService.init()).rejects.toThrow('Incorrect password.');
  });
});
