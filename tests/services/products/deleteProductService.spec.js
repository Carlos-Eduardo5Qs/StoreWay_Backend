const DeleteProduct = require('../../../src/services/products/DeleteProductService');
const SearchProduct = require('../../../src/models/products/SearchProductModel');
const DeleteProducts = require('../../../src/models/products/DeleteProductModel');
const B2 = require('backblaze-b2');

jest.mock('dotenv', () => ({
    config: jest.fn(),
}));

jest.mock('backblaze-b2');
jest.mock('../../../src/models/products/SearchProductModel');
jest.mock('../../../src/models/products/DeleteProductModel');

describe('DeleteProduct Service', () => {
    let deleteProductInstance;

    beforeEach(() => {
        B2.mockImplementation(() => ({
            authorize: jest.fn(),
            listFileNames: jest.fn(),
            deleteFileVersion: jest.fn(),
        }));
        deleteProductInstance = new DeleteProduct(1);
    });

    it('should return false if product is not found', async () => {
        SearchProduct.mockImplementation(() => ({
            find: jest.fn().mockResolvedValue(null),
        }));

        const result = await deleteProductInstance.delete();
        expect(result).toBe(false);
    });

    it('should return false if file does not exist', async () => {
        SearchProduct.mockImplementation(() => ({
            find: jest.fn().mockResolvedValue({ image_filename: 'test.png' }),
        }));
        deleteProductInstance.b2.listFileNames.mockResolvedValue({ data: { files: [] } });

        const result = await deleteProductInstance.delete();
        expect(result).toBe(false);
    });

    it('should delete the product if it exists and file is found', async () => {
        const mockProduct = { id: 1, image_filename: 'test.png', image_id: '12345' };

        SearchProduct.mockImplementation(() => ({
            find: jest.fn().mockResolvedValue(mockProduct),
        }));
        deleteProductInstance.b2.listFileNames.mockResolvedValue({ data: { files: [mockProduct] } });
        deleteProductInstance.b2.deleteFileVersion.mockResolvedValue({});

        DeleteProducts.mockImplementation(() => ({
            delete: jest.fn().mockResolvedValue(true),
        }));

        const result = await deleteProductInstance.delete();
        expect(result).toBe(true);
    });

    it('should throw an error if deleteImage fails', async () => {
        const mockProduct = { id: 1, image_filename: 'test.png', image_id: '12345' };

        SearchProduct.mockImplementation(() => ({
            find: jest.fn().mockResolvedValue(mockProduct),
        }));
        deleteProductInstance.b2.listFileNames.mockResolvedValue({ data: { files: [mockProduct] } });
        deleteProductInstance.b2.deleteFileVersion.mockRejectedValue(new Error('Failed to delete'));

        await expect(deleteProductInstance.delete()).rejects.toThrow('Error deleting file: Failed to delete');
    });

    it('should throw an error if find() throws', async () => {
        SearchProduct.mockImplementation(() => ({
            find: jest.fn().mockRejectedValue(new Error('Test error')),
        }));
        await expect(deleteProductInstance.findProduct()).rejects.toThrow('Error finding products: Test error');
    });

    it('should throw an error if listFileNames() fails', async () => {
        deleteProductInstance.b2.listFileNames.mockRejectedValue(new Error('Test error'));
        await expect(deleteProductInstance.doesFileExist('test-file')).rejects.toThrow('Error confirming file existence: Test error');
    });

    it('should throw an error if fileName or fileId is missing', async () => {
        await expect(deleteProductInstance.deleteImage(null, 'fileId')).rejects.toThrow('Error: fileName or fileId not set.');
        await expect(deleteProductInstance.deleteImage('fileName', null)).rejects.toThrow('Error: fileName or fileId not set.');
    });

    it('should return false if deleting from database fails', async () => {
        const mockProduct = { id: 1, image_filename: 'test.png', image_id: '12345' };

        SearchProduct.mockImplementation(() => ({
            find: jest.fn().mockResolvedValue(mockProduct),
        }));
        deleteProductInstance.b2.listFileNames.mockResolvedValue({ data: { files: [mockProduct] } });
        deleteProductInstance.b2.deleteFileVersion.mockResolvedValue({});

        DeleteProducts.mockImplementation(() => ({
            delete: jest.fn().mockResolvedValue(false),
        }));

        const result = await deleteProductInstance.delete();
        expect(result).toBe(false);
    });
});
