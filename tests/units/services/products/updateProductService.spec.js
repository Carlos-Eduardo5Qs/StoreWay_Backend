const B2 = require('backblaze-b2')
const CheckProduct = require('../../../../src/models/products/SearchProductModel');
const UpdatedProductModel = require('../../../../src/models/products/UpdateProductModel');
const UpdateProduct = require('../../../../src/services/products/UpdateProductService');

jest.mock('backblaze-b2');
jest.mock('../../../../src/models/products/SearchProductModel');
jest.mock('../../../../src/models/products/UpdateProductModel');

describe('UpdateProduct Service', () => {
    let updateProduct;
    const mockProductData = {
        id: 'product-id',
        name: 'Product-name',
        image: { originalName: 'product.jpg', buffer: Buffer.from('image data') },
        description: 'Product description',
        price: '100.00',
        category_id: '1',
        brand: 'Brand',
        stock: 10,
    };

    beforeEach(() => {
        B2.mockClear();
        CheckProduct.mockClear();
        UpdatedProductModel.mockClear();

        process.env.KEY_ID = 'test-key-id';
        process.env.APP_KEY = 'test-app-key';
        process.env.BUCKET_ID = 'test-bucket-id';
        process.env.BUCKET_NAME = 'test-bucket-name';

        updateProduct = new UpdateProduct(
            mockProductData.id,
            mockProductData.name,
            mockProductData.image,
            mockProductData.description,
            mockProductData.price,
            mockProductData.category_id,
            mockProductData.brand,
            mockProductData.stock,
        );
    });

    it('Should update product successfully', async () => {
        updateProduct.searchProduct = jest.fn().mockResolvedValue({});
        updateProduct.isProductUpdated = jest.fn().mockResolvedValue(true);
        updateProduct.updateImage = jest.fn().mockResolvedValue({
            url: 'https://example.com/image.jpg',
            id: 'image-id',
            fileName: 'product.jpg',
        });

        const mockUpdate = { update: jest.fn().mockResolvedValue(true) };
        UpdatedProductModel.mockImplementation(() => mockUpdate);

        const result = await updateProduct.updateProduct();

        expect(result).toBe(true);
        expect(updateProduct.searchProduct).toHaveBeenCalled();
        expect(updateProduct.isProductUpdated).toHaveBeenCalled();
        expect(updateProduct.updateImage).toHaveBeenCalled();
        expect(mockUpdate.update).toHaveBeenCalled();
    });

    it('Should return false if product does not exist', async () => {
        updateProduct.searchProduct = jest.fn().mockResolvedValue({});
        updateProduct.isProductUpdated = jest.fn().mockReturnValue(false);

        const result = await updateProduct.updateProduct();

        expect(result).toBe('false');
        expect(updateProduct.isProductUpdated).toHaveBeenCalled();
    });

    it('should return false if product is not updated', async () => {
        updateProduct.searchProduct = jest.fn().mockResolvedValue({});
        updateProduct.isProductUpdated = jest.fn().mockReturnValue(false);

        const result = await updateProduct.updateProduct();

        expect(result).toBe('false');
        expect(updateProduct.isProductUpdated).toHaveBeenCalled();
    });

    it('should throw error if updating image fails', async () => {
        updateProduct.searchProduct = jest.fn().mockResolvedValue({});
        updateProduct.isProductUpdated = jest.fn().mockReturnValue(true);
        updateProduct.updateImage = jest.fn().mockRejectedValue(new Error('Image update failed'));

        await expect(updateProduct.updateProduct()).rejects.toThrow('Image update failed');
    });

    it('Should return false if updating database fails', async () => {
        updateProduct.searchProduct = jest.fn().mockResolvedValue({});
        updateProduct.isProductUpdated = jest.fn().mockReturnValue(true);
        updateProduct.updateImage = jest.fn().mockResolvedValue({
            url: 'https://example.com/image.jpg',
            id: 'image-id',
            fileName: 'product.jpg',
        });

        const mockUpdate = { update: jest.fn().mockResolvedValue(false) };
        UpdatedProductModel.mockImplementation(() => mockUpdate);

        const result = await updateProduct.updateProduct();

        expect(result).toBe(false);
        expect(mockUpdate.update).toHaveBeenCalled();
    });

    it('should return true if any product property has changed', () => {
        const currentProduct = {
            name: 'Different Name',
            image_filename: 'different.jpg',
            description: 'Different description',
            price: '150.00',
            category: 'Different Category',
            brand: 'Different Brand',
            stock: 5,
        };
        const result = updateProduct.isProductUpdated(currentProduct);
        expect(result).toBe(true);
    });

    it('should return false if all product properties are the same', () => {
        // Dados de entrada para um produto que não mudou
        const currentProduct = {
          name: mockProductData.name,
          image_filename: mockProductData.image.originalname,
          description: mockProductData.description,
          price: mockProductData.price,
          category_id: mockProductData.category,
          brand: mockProductData.brand,
          stock: mockProductData.stock,
        };
      
        // Espera-se que a comparação retorne false, pois todos os valores são iguais
        const result = updateProduct.isProductUpdated(currentProduct);
      
        expect(result).toBe(false);
      });

    it('should return updated image info when successful', async () => {
        updateProduct.searchProduct = jest.fn().mockResolvedValue({ image_filename: 'old-image.jpg' });
        updateProduct.doesFileExist = jest.fn().mockResolvedValue(true);
        updateProduct.deleteImage = jest.fn().mockResolvedValue();
        updateProduct.uploadImage = jest.fn().mockResolvedValue({
            url: 'https://example.com/new-image.jpg',
            id: 'new-image-id',
            fileName: 'new-image.jpg',
        });

        const result = await updateProduct.updateImage();
        expect(result).toEqual({
            url: 'https://example.com/new-image.jpg',
            id: 'new-image-id',
            fileName: 'new-image.jpg',
        });
    });

    it('should throw error if file does not exist', async () => {
        updateProduct.searchProduct = jest.fn().mockResolvedValue({});
        updateProduct.doesFileExist = jest.fn().mockResolvedValue(false);

        await expect(updateProduct.updateImage()).rejects.toThrow('Error when updating product.');
    });

    it('should return upload info when successful', async () => {
        updateProduct.b2.authorize = jest.fn().mockResolvedValue({ data: { downloadUrl: 'https://example.com' } });
        updateProduct.b2.getUploadUrl = jest.fn().mockResolvedValue({
            data: { uploadUrl: 'https://upload.example.com', authorizationToken: 'auth-token' },
        });
        updateProduct.b2.uploadFile = jest.fn().mockResolvedValue({
            data: { fileId: 'file-id', fileName: 'file-name.jpg' },
        });

        const result = await updateProduct.uploadImage();

        expect(result).toEqual({
            url: 'https://example.com/file/test-bucket-name/products/undefined',
            id: 'file-id',
            fileName: 'file-name.jpg',
        });
    });

    it('should throw error if upload fails', async () => {
        updateProduct.b2.authorize = jest.fn().mockRejectedValue(new Error('Authorization failed'));

        await expect(updateProduct.uploadImage()).rejects.toThrow('Error uploading image: Authorization failed');
    });

    it('should delete image successfully', async () => {
        updateProduct.b2.authorize = jest.fn().mockResolvedValue();
        updateProduct.b2.deleteFileVersion = jest.fn().mockResolvedValue();

        await expect(updateProduct.deleteImage('file-name', 'file-id')).resolves.not.toThrow();
    });

    it('should throw error if delete fails', async () => {
        updateProduct.b2.authorize = jest.fn().mockResolvedValue();
        updateProduct.b2.deleteFileVersion = jest.fn().mockRejectedValue(new Error('Delete failed'));

        await expect(updateProduct.deleteImage('file-name', 'file-id')).rejects.toThrow('Error deleting file file-name with fileId file-id: Delete failed');
    });

    it('should return true if file exists', async () => {
        updateProduct.b2.authorize = jest.fn().mockResolvedValue();
        updateProduct.b2.listFileNames = jest.fn().mockResolvedValue({ data: { files: [{}] } });

        const result = await updateProduct.doesFileExist('file-name');
        expect(result).toBe(true);
    });

    it('should return false if file does not exist', async () => {
        updateProduct.b2.authorize = jest.fn().mockResolvedValue();
        updateProduct.b2.listFileNames = jest.fn().mockResolvedValue({ data: { files: [] } });

        const result = await updateProduct.doesFileExist('file-name');
        expect(result).toBe(false);
    });

    it('should throw error if checking file existence fails', async () => {
        updateProduct.b2.authorize = jest.fn().mockResolvedValue();
        updateProduct.b2.listFileNames = jest.fn().mockRejectedValue(new Error('List files failed'));

        await expect(updateProduct.doesFileExist('file-name')).rejects.toThrow('Error checking if the file exists: List files failed');
    });

    it('should throw an error when product search fails', async () => {
        const mockFind = jest.fn().mockRejectedValue(new Error('Produto não encontrado'));
        CheckProduct.mockImplementation(() => ({
            find: mockFind,
        }));

        await expect(updateProduct.searchProduct()).rejects.toThrow(
            'Error fiding product: Produto não encontrado'
        );
        expect(mockFind).toHaveBeenCalledTimes(1);
        expect(CheckProduct).toHaveBeenCalledWith('product-id');
    });

    it('should return the product when the search is successful', async () => {
        const mockFind = jest.fn().mockResolvedValue({ id: 123, name: 'product test' });
        CheckProduct.mockImplementation(() => ({
            find: mockFind,
        }));

        const product = await updateProduct.searchProduct();

        expect(product).toEqual({ id: 123, name: 'product test' });
        expect(mockFind).toHaveBeenCalledTimes(1);
        expect(CheckProduct).toHaveBeenCalledWith('product-id');
    });
});
