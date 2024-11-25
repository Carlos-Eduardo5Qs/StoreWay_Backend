const PasswordValidator = require('password-validator');
const validator = require('validator');
const bcrypt = require('bcrypt');

const CreateAccount = require('../../../../src/services/users/CreateAccountService');
const RegisterAccount = require('../../../../src/models/users/CreateAccountModel');
const Nodemailer = require('../../../../src/services/NodemailerService');
const generateNickname = require('../../../../src/utils/generateNickname');

jest.mock('password-validator');
jest.mock('validator');
jest.mock('bcrypt');
jest.mock('../../../../src/models/users/CreateAccountModel');
jest.mock('../../../../src/services/NodemailerService');
jest.mock('../../../../src/utils/generateNickname');

describe('CreateAccount Service', () => {
  beforeEach(() => {
    PasswordValidator.mockImplementation(() => {
      return {
        is: jest.fn().mockReturnThis(),
        min: jest.fn().mockReturnThis(),
        max: jest.fn().mockReturnThis(),
        has: jest.fn().mockReturnThis(),
        uppercase: jest.fn().mockReturnThis(),
        lowercase: jest.fn().mockReturnThis(),
        digits: jest.fn().mockReturnThis(),
        validate: jest.fn().mockReturnValue(true),
      };
    });

    jest.clearAllMocks();
  });

  it('should throw an error if email is invalid', () => {
    validator.isEmail.mockReturnValue(false);

    expect(() => {
      new CreateAccount('John Doe', 'invalid-email', 'Password1', 'Password1');
    }).toThrow('Invalid email');
  });

  it('should throw an error if passwords do not match', () => {
    validator.isEmail.mockReturnValue(true);

    expect(() => {
      new CreateAccount('John Doe', 'john@example.com', 'Password1', 'Password2');
    }).toThrow('Passwords must be the same.');
  });


  it('should register account if all validations pass', () => {
    validator.isEmail.mockReturnValue(true);

    const schemaMock = new PasswordValidator();
    schemaMock.validate.mockReturnValue(true);

    bcrypt.genSaltSync.mockReturnValue('salt');
    bcrypt.hashSync.mockReturnValue('hashed-password');
    generateNickname.mockReturnValue('coolNickname');

    new CreateAccount('John Doe', 'john@example.com', 'Password1', 'Password1');

    expect(RegisterAccount).toHaveBeenCalledWith([
      'coolNickname',
      'John Doe',
      'john@example.com',
      'hashed-password',
    ]);

    expect(Nodemailer).toHaveBeenCalledWith(
      'John Doe',
      'john@example.com',
      'Boas vindas',
      expect.stringContaining('É um prazer recebê-lo(a)')
    );
  });
});
