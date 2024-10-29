const SearchByCategory = require('../../../../src/models/products/SearchByCategoryModel');
const Database = require('../../../../src/config/Database');

jest.mock('../../../../src/config/Database');

describe('SearchByCategoryModel', () => {
    let mockConnection;
    const category = 'Electronics';

    beforeEach(() => {
        jest.clearAllMocks();

        mockConnection = {
            execute: jest.fn(),
            release: jest.fn(),
        };

        Database.prototype.openConnection = jest.fn().mockResolvedValue(mockConnection);
        Database.prototype.releaseConnection = jest.fn();
    });

    it('Should return all products for the specified category', async () => {
        const mockRows = [
            { id: 1, name: 'Product 1', category: 'Electronics' },
            { id: 2, name: 'Product 2', category: 'Electronics' },
        ];

        mockConnection.execute.mockResolvedValue([mockRows]);

        const searchByCategory = new SearchByCategory(category);
        const result = await searchByCategory.search();

        expect(mockConnection.execute).toHaveBeenCalledTimes(1);
        expect(mockConnection.execute).toHaveBeenCalledWith('SELECT * FROM products WHERE category = ?', [category]);
        expect(result).toEqual(mockRows);
        expect(Database.prototype.releaseConnection).toHaveBeenCalledWith(mockConnection);
    });

    it('Should return false when there are no products for the specified category', async () => {
        mockConnection.execute.mockResolvedValue([[]]);

        const searchByCategory = new SearchByCategory(category);
        const result = await searchByCategory.search();

        expect(mockConnection.execute).toHaveBeenCalledTimes(1);
        expect(mockConnection.execute).toHaveBeenCalledWith('SELECT * FROM products WHERE category = ?', [category]);
        expect(result).toBe(false);
        expect(Database.prototype.releaseConnection).toHaveBeenCalledWith(mockConnection);
    });

    it('Should throw an error if there is a database error', async () => {
        mockConnection.execute.mockRejectedValueOnce(new Error('Simulated Database Error'));

        const searchByCategory = new SearchByCategory(category);

        await expect(searchByCategory.search()).rejects.toThrow('DATABASE ERROR: Simulated Database Error');
        expect(Database.prototype.releaseConnection).toHaveBeenCalledWith(mockConnection);
    });
});