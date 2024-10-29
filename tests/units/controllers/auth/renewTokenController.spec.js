const jwt = require('jsonwebtoken');
const { renew } = require('../../../../src/controllers/auth/renewTokenController');

jest.mock('jsonwebtoken');

describe('renewController', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {
        refreshToken: 'some_refresh_token'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  it('Should return 200 and new tokens if refresh token is valid', () => {
    const mockDecoded = { id: '123' };
    const newAccessToken = 'new_access_token';
    const newRefreshToken = 'new_refresh_token';

    jwt.verify.mockReturnValue(mockDecoded);
    jwt.sign
      .mockReturnValueOnce(newAccessToken)
      .mockReturnValueOnce(newRefreshToken);

    renew(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: {
        newAccessToken,
        newRefreshToken,
      },
    });
  });

  it('Should return 403 if the refresh token is invalid', () => {
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    renew(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ data: { message: 'Invalid refresh token' } });
  });
});