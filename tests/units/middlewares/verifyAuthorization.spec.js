const jwt = require('jsonwebtoken');
const VerifyAuthorizationModel = require('../../../src/models/users/verifyAuthorizarionModel');
const verify = require('../../../src/middlewares/verifyAuthorizarion');

jest.mock('jsonwebtoken');
jest.mock('../../../src/models/users/verifyAuthorizarionModel');

describe('verifyAuthorization Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    
    jest.clearAllMocks();
  });

  it('Should return 401 if authorization token is not provided', async () => {
    await verify(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ data: { message: 'Authorization token not provided.' } });
  });

  it('Should return 401 if the token is invalid', async () => {
    req.headers.authorization = 'invalidToken';
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await verify(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ data: { message: 'Invalid token.' } });
  });

  it('Should return 403 if user is not an administrator', async () => {
    req.headers.authorization = 'validToken';
    jwt.verify.mockReturnValue({ id: 'userId' });

    VerifyAuthorizationModel.mockImplementation(() => {
      return {
        isAdm: jest.fn().mockResolvedValue(false),
      };
    });

    await verify(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ data: { message: 'Access denied.' } });
  });

  it('Should call next if user is an administrator', async () => {
    req.headers.authorization = 'validToken';
    jwt.verify.mockReturnValue({ id: 'adminId' });

    VerifyAuthorizationModel.mockImplementation(() => {
      return {
        isAdm: jest.fn().mockResolvedValue(true),
      };
    });

    await verify(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
