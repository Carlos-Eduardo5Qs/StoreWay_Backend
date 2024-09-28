const SearchAllProducts = require('../../../../src/models/products/SearchAllProductsModel');
const Database = require('../../../../src/config/Database');

jest.mock('../../../../src/config/Database');

describe('SearchAllProductsModel', () => {
    let mockConnection;

    beforeEach(() => {
        jest.clearAllMocks();

        mockConnection = {
            execute: jest.fn(),
            release: jest.fn(),
        };

        Database.prototype.openConnection = jest.fn().mockResolvedValue(mockConnection);
        Database.prototype.releaseConnection = jest.fn();
    });

    it('Should return all products when the database has products', async () => {
        const mockRows = [
            { id: 1, name: 'Product 1' },
            { id: 2, name: 'Product 2' },
        ];

        mockConnection.execute.mockResolvedValue([mockRows]);

        const searchAllProducts = new SearchAllProducts();
        const result = await searchAllProducts.search();

        expect(mockConnection.execute).toHaveBeenCalledTimes(1);
        expect(mockConnection.execute).toHaveBeenCalledWith('SELECT * FROM products');
        expect(result).toEqual(mockRows);
        expect(Database.prototype.releaseConnection).toHaveBeenCalledWith(mockConnection);
    });

    it('Should return false when there are no products in the database', async () => {
        mockConnection.execute.mockResolvedValue([[]]);

        const searchAllProducts = new SearchAllProducts();
        const result = await searchAllProducts.search();

        expect(mockConnection.execute).toHaveBeenCalledTimes(1);
        expect(mockConnection.execute).toHaveBeenCalledWith('SELECT * FROM products');
        expect(result).toBe(false);
        expect(Database.prototype.releaseConnection).toHaveBeenCalledWith(mockConnection);
    });

    it('Should throw an error if there is a database error', async () => {
        mockConnection.execute.mockRejectedValueOnce(new Error('Simulated Database Error'));

        const searchAllProducts = new SearchAllProducts();

        await expect(searchAllProducts.search()).rejects.toThrow('DATABASE ERROR: Simulated Database Error');
        expect(Database.prototype.releaseConnection).toHaveBeenCalledWith(mockConnection);
    });
});
