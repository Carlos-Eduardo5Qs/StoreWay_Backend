const SearchByCategoryModel = require('../../../../src/models/products/SearchByCategoryModel');
const { searchByCategory } = require('../../../../src/controllers/products/searchByCategoryController');

jest.mock('../../../../src/models/products/SearchByCategoryModel');

describe('searchByCategoryController', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      params: {
        category: 'Electronics'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  it('Should return 403 if category is missing', async () => {
    req.params.category = '';

    await searchByCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ data: { message: 'Error' } });
  });

  it('Should return 404 if no products are found in the category', async () => {
    SearchByCategoryModel.mockImplementation(() => {
      return {
        search: jest.fn().mockResolvedValue(null)
      };
    });

    await searchByCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ data: { message: 'No products found in this category' } });
  });

  it('Should return 200 and products if found in the category', async () => {
    const mockProducts = [
      { id: 1, name: 'Product 1', image_id: 'img1', image_filename: 'img1.jpg' },
      { id: 2, name: 'Product 2', image_id: 'img2', image_filename: 'img2.jpg' }
    ];

    SearchByCategoryModel.mockImplementation(() => {
      return {
        search: jest.fn().mockResolvedValue(mockProducts)
      };
    });

    await searchByCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: {
        message: [
          { id: 1, name: 'Product 1' },
          { id: 2, name: 'Product 2' }
        ]
      }
    });
  });

  it('Should return 500 if an error is thrown', async () => {
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

    SearchByCategoryModel.mockImplementation(() => {
      return {
        search: jest.fn().mockRejectedValue(new Error('Simulated Error'))
      };
    });

    await searchByCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      data: { message: 'An error occurred while listing the products by category. Please try again later.' }
    });
    expect(console.error).toHaveBeenCalledWith('Simulated Error');

    consoleErrorMock.mockRestore();
  });
});