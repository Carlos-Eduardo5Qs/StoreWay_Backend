const DeleteProduct = require('../../src/models/products/DeleteProductModel');
const Database = require('../../src/config/Database');
const { isTaxID } = require('validator');

jest.mock('../../src/config/Database');

describe('Delete product model', () => {
    let deleteProduct;
    let mockConnection;

    beforeEach(() => {
        jest.clearAllMocks();

        mockConnection = {
            execute: jest.fn().mockResolvedValue(),
            release: jest.fn(),
        };

        Database.prototype.openConnection = jest.fn().mockResolvedValue(mockConnection);
        Database.prototype.releaseConnection = jest.fn();
    });

    it('Should delete a product from the datanase with correct SQL query and parameters', async () => {
        deleteProduct = new DeleteProduct(1);

        await deleteProduct.delete();

        expect(mockConnection.execute).toHaveBeenCalledTimes(1);
        expect(mockConnection.execute).toHaveBeenCalledWith(
            'DELETE FROM products WHERE id = ?',
            [1]
        );

        expect(Database.prototype.releaseConnection).toHaveBeenCalledWith(mockConnection);
    });

    it('Should throw an error if there is a database error during deletion', async () => {
        mockConnection.execute.mockRejectedValueOnce(new Error('Simulated Error'));

        deleteProduct = new DeleteProduct(1);

        await expect(deleteProduct.delete()).rejects.toThrow('DATABASE ERROR: Simulated Error');

        expect(Database.prototype.releaseConnection).toHaveBeenCalledWith(mockConnection);
    });
});