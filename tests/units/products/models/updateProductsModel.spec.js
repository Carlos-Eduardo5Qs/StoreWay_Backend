const UpdateProduct = require('../../../../src/models/products/UpdateProductModel');
const Database = require('../../../../src/config/Database');

jest.mock('../../../../src/config/Database');

describe('Update product model', () => {
    let productData;
    let mockConnection;

    beforeEach(() => {
        jest.clearAllMocks();

        productData = [
            'newName','newImage', 'newImageId', 'newImageFilename',
            'newDescription', 'newPrice', 'newCategory', 'newBrand','newStock', 'productId'
        ];

        mockConnection = {
            execute: jest.fn().mockResolvedValue([{ affectedRows: 1 }]),
            release: jest.fn(),
        };

        Database.prototype.openConnection = jest.fn().mockResolvedValue(mockConnection);
        Database.prototype.releaseConnection = jest.fn();
    });

    it('Should update a product in the database with correct SQL query and parameters', async() => {
        const updateProduct = new UpdateProduct(productData);

        await updateProduct.update();

        expect(mockConnection.execute).toHaveBeenCalledTimes(1);
        expect(mockConnection.execute).toHaveBeenCalledWith(
            'UPDATE products SET name = ?, image = ?, image_id = ?, image_filename = ?, description = ?, price = ?, category = ?, brand = ?, stock = ? WHERE id = ?',
            productData
        );

        expect(Database.prototype.releaseConnection).toHaveBeenCalledWith(mockConnection);
    });

    it('Should throw an error if there is a database error', async () => {
        mockConnection.execute.mockRejectedValueOnce(new Error('Simulated Error'));

        const updateProduct = new UpdateProduct(productData);

        await expect(updateProduct.update()).rejects.toThrow('DATABASE ERROR: Simulated Error');
    });
});