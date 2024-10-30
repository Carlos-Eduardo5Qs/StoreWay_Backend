const jwt = require('jsonwebtoken');
const verifyToken = require('../../../src/middlewares/verifyToken');

jest.mock('jsonwebtoken');

describe('verifyToken Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('Should return 401 if authorization token is not provided', async () => {
    await verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token not provide' });
  });

  it('Should return 401 if the token is invalid', async () => {
    req.headers.authorization = 'invalidToken';
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token.' });
  });

  it('Should call next if the token is valid', async () => {
    req.headers.authorization = 'validToken';
    jwt.verify.mockReturnValue({ id: 'userId' });

    await verifyToken(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
