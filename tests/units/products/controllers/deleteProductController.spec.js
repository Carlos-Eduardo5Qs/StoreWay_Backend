const DeleteProductService = require('../../../../src/services/products/DeleteProductService');

const { delete: deleteProduct } = require('../../../../src/controllers/products/deleteProductController');

jest.mock('../../../../src/services/products/DeleteProductService');

describe('deleteProductController', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            params: {
                id: '123'
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.clearAllMocks();
    });

    it('Should return 400 if no ID is provided', async () => {
        req.params.id = '';

        await deleteProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ data: { message: 'Invalid product ID.' } });
    });

    it('Should return 404 if the product not found', async () => {
        DeleteProductService.mockImplementation(() => {
            return {
                delete: jest.fn().mockResolvedValue(false),
            };
        });

        await deleteProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ data: { message: 'Product not found' } });
    });

    it('Should return 500 if an error is thrown', async () => {
        const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

        DeleteProductService.mockImplementation(() => {
            return {
                delete: jest.fn().mockRejectedValue(new Error('Simulated Error')),
            };
        });


        await deleteProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ data: { message: 'An error occurred while deleting the product. Please try again later.' } });
        expect(console.error).toHaveBeenCalledWith('Simulated Error');

        consoleErrorMock.mockRestore();
    });

    it('Should return 200 if the product is deleted successfully', async () => {
        DeleteProductService.mockImplementation(() => {
          return {
            delete: jest.fn().mockResolvedValue(true),
          };
        });
    
        await deleteProduct(req, res);
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ data: { message: 'Product Deleted successfully' } });
      });
});
