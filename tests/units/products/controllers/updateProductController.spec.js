const UpdateProduct = require('../../../../src/services/products/UpdateProductService');
const { update } = require('../../../../src/controllers/products/updateProductController');

jest.mock('../../../../src/services/products/UpdateProductService');

describe('updateProductController', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            body: {
                id: 1,
                name: 'New Product Name',
                description: 'New description',
                price: 100,
                category: 'Electronics',
                brand: 'BrandName',
                stock: 50,
            },
            file: {
                filename: 'image.jpg'
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.clearAllMocks();
    });

    it('Should return 400 se any required field is missing', async () => {
        req.body.name = '';

        await update(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            data: { message: 'All fields mandatory.' },
        });
    });

    it('Should return 404 if the product is not found', async () => {
        UpdateProduct.mockImplementation(() => {
            return {
                updateProduct: jest.fn().mockResolvedValue(null),
            };
        });

        await update(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            data: { message: 'Product not found' },
        });
    });

    it('Should return 200 if the product was update successfully', async () => {
        UpdateProduct.mockImplementation(() => {
            return {
                updateProduct: jest.fn().mockResolvedValue(true),
            };
        });

        await update(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            data: { message: 'Updated product successfuly.' },
        });
    });

    it('Should return 409 if the product is already up to date', async () => {
        UpdateProduct.mockImplementation(() => {
            return {
                updateProduct: jest.fn().mockResolvedValue('false'),
            };
        });

        await update(req, res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
            data: { message: 'Product is up to date' },
        });
    });

    it('Should return 500 if an error occurs during the update process', async () => {
        const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

        UpdateProduct.mockImplementation(() => {
            return {
                updateProduct: jest.fn().mockRejectedValue(new Error('Simulated Error')),
            };
        });

        await update(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            data: { message: 'An error occurred while updating the product. Please try again later.' },
        });
        expect(console.error).toHaveBeenCalledWith('Simulated Error');
    });
});
