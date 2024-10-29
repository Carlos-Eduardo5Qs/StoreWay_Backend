const CreateProductService = require('../../../../src/services/products/CreateProductService');
const { create } = require('../../../../src/controllers/products/createProductController');

jest.mock('../../../../src/services/products/CreateProductService');

describe('createProductController', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {
        name: 'Product Name',
        description: 'Product Description',
        price: 100,
        category: 'Electronics',
        brand: 'BrandX',
        stock: 10
      },
      file: { path: 'fakepath/to/image.jpg' }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  it('Should return 400 if any required field is missing', async () => {
    req.body.name = '';

    await create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ data: { message: 'All field are mandatory.' } });
  });

  it('Should return 200 if the product is created successfully', async () => {
    CreateProductService.mockImplementation(() => {
      return {
        create: jest.fn().mockResolvedValue(true),
      };
    });

    await create(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Created product successfuly.' });
  });

  it('Should return 500 if the service fails to create a product', async () => {
    CreateProductService.mockImplementation(() => {
      return {
        create: jest.fn().mockResolvedValue(false),
      };
    });

    await create(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ data: { message: 'Something wrong happened, sorry :(' } });
  });

  it('Should return 500 if an error is thrown', async () => {
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

    CreateProductService.mockImplementation(() => {
      return {
        create: jest.fn().mockRejectedValue(new Error('Simulated Error')),
      };
    });

    await create(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ data: { message: 'An error occurred while creating the product. Please try again later.' } });
    expect(console.error).toHaveBeenCalledWith('Simulated Error');

    consoleErrorMock.mockRestore();
  });
});