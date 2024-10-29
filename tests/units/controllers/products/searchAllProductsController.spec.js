const SearchAllProducts = require('../../../../src/models/products/SearchAllProductsModel');
const { searchAllProducts } = require('../../../../src/controllers/products/searchAllProductsController');

jest.mock('../../../../src/models/products/SearchAllProductsModel');

describe('searchAllProductsController', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {};

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  it('Should return 404 if no products are found', async () => {
    SearchAllProducts.mockImplementation(() => {
      return {
        search: jest.fn().mockResolvedValue([])
      };
    });

    await searchAllProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ data: { message: 'No products found;' } });
  });

  it('Should return 200 and list of products if products are found', async () => {
    const mockProducts = [
      { id: 1, name: 'Product 1', image_id: 'img1', image_filename: 'img1.jpg' },
      { id: 2, name: 'Product 2', image_id: 'img2', image_filename: 'img2.jpg' }
    ];

    SearchAllProducts.mockImplementation(() => {
      return {
        search: jest.fn().mockResolvedValue(mockProducts)
      };
    });

    await searchAllProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: {
        products: [
          { id: 1, name: 'Product 1' },
          { id: 2, name: 'Product 2' }
        ]
      }
    });
  });

  it('Should return 500 if an error is thrown', async () => {
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

    SearchAllProducts.mockImplementation(() => {
      return {
        search: jest.fn().mockRejectedValue(new Error('Simulated Error'))
      };
    });

    await searchAllProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      data: { message: 'An error occurred while listing the products. Please try again later.' }
    });
    expect(console.error).toHaveBeenCalledWith('Simulated Error');

    consoleErrorMock.mockRestore();
  });
});