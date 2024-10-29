const CreateProduct = require('../../../../src/models/products/CreateProductModel');
const Database = require('../../../../src/config/Database');

jest.mock('../../../../src/config/Database');

describe('CreateProductsModel', () => {
    let productData;
    let mockConnection;

    beforeEach(() => {
        jest.clearAllMocks();

        productData = [
            'name', 'image', 'image_id', 'image_filename',
            'description', 'price', 'category', 'brand', 'stock'
        ];

        mockConnection = {
            execute: jest.fn().mockResolvedValue([{ affectedRows: 1 }]),
            release: jest.fn(),
        };

        Database.prototype.openConnection = jest.fn().mockResolvedValue(mockConnection);
        Database.prototype.releaseConnection = jest.fn();
    });

    it('Should insert a product into the database with correct SQL query and parameters', async () => {
        const createProduct = new CreateProduct(productData);

        await createProduct.register()

        expect(mockConnection.execute).toHaveBeenCalledTimes(1);
        expect(mockConnection.execute).toHaveBeenCalledWith(
            'INSERT INTO products (name, image, image_id, image_filename, description, price, category, brand, stock) VALUES(?,?,?,?,?,?,?,?,?)',
            productData
        );

        expect(Database.prototype.releaseConnection).toHaveBeenCalledWith(mockConnection);
    });

    it('Should throw an error if there is a database error', async () => {
        mockConnection.execute.mockRejectedValueOnce(new Error('Simulated Error'));

        const createProduct = new CreateProduct(productData);

        await expect(createProduct.register()).rejects.toThrow('DATABASE ERROR: Simulated Error');

        expect(Database.prototype.releaseConnection).toHaveBeenCalledWith(mockConnection);
    });
});