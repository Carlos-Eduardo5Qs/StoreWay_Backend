const SearchProduct = require('../../../../src/models/products/SearchProductModel');
const Database = require('../../../../src/config/Database');

jest.mock('../../../../src/config/Database');

describe('SearchProductModel', () => {
    let mockConnection;
    let productId;

    beforeEach(() => {
        jest.clearAllMocks();

        productId = 1;

        mockConnection = {
            execute: jest.fn().mockResolvedValue([[{ id: productId, name: 'Test Product' }]]),
            release: jest.fn(),
        };

        Database.prototype.openConnection = jest.fn().mockResolvedValue(mockConnection);
        Database.prototype.releaseConnection = jest.fn();
    });

    it('Should find a product by id with correct SQL query and parameters', async () => {
        const searchProduct = new SearchProduct(productId);

        const result = await searchProduct.find();

        expect(mockConnection.execute).toHaveBeenCalledTimes(1);
        expect(mockConnection.execute).toHaveBeenCalledWith(
            'SELECT * FROM products WHERE id = ?',
            [productId]
        );
        expect(result).toEqual({ id: productId, name: 'Test Product' });
        expect(Database.prototype.releaseConnection).toHaveBeenCalledWith(mockConnection);
    });

    it('Should return false if no product is found', async () => {
        mockConnection.execute.mockResolvedValue([[]]);

        const searchProduct = new SearchProduct(productId);

        const result = await searchProduct.find();

        expect(result).toBe(false);
        expect(mockConnection.execute).toHaveBeenCalledWith(
            'SELECT * FROM products WHERE id = ?',
            [productId]
        );
        expect(Database.prototype.releaseConnection).toHaveBeenCalledWith(mockConnection);
    });

    it('Should handle database errors gracefully', async () => {
        mockConnection.execute.mockRejectedValueOnce(new Error('Simulated Error'));

        const searchProduct = new SearchProduct(productId);

        await expect(searchProduct.find()).rejects.toThrow('DATABASE ERROR: Simulated Error');

        expect(Database.prototype.releaseConnection).toHaveBeenCalledWith(mockConnection);
    });
});