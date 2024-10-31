const B2 = require('backblaze-b2');
const RegisterProduct = require('../../../src/models/products/CreateProductModel');
const CreateProduct = require('../../../src/services/products/CreateProductService');

jest.mock('backblaze-b2');
jest.mock('../../../src/models/products/CreateProductModel');

const mockProductData = {
    name: 'Produto Teste',
    image: { originalname: 'test.jpg', buffer: Buffer.from('test image data') },
    description: 'Descrição do produto teste',
    price: '49.99',
    category: 'Categoria Teste',
    brand: 'Marca Teste',
    stock: '15',
};

describe('CreateProduct Service', () => {
    let service;

    beforeEach(() => {
        service = new CreateProduct(
            mockProductData.name,
            mockProductData.image,
            mockProductData.description,
            mockProductData.price,
            mockProductData.category,
            mockProductData.brand,
            mockProductData.stock
        );

        jest.clearAllMocks();
    });

    it('deve retornar false ao falhar no registro do produto', async () => {
        B2.mockImplementation(() => ({
            authorize: jest.fn().mockResolvedValue({ data: { downloadUrl: 'http://download.com' } }),
            getUploadUrl: jest.fn().mockResolvedValue({
                data: { authorizationToken: 'token', uploadUrl: 'http://upload.com' },
            }),
            uploadFile: jest.fn().mockResolvedValue({
                data: { fileId: '12345', fileName: 'test.jpg' },
            }),
        }));

        RegisterProduct.prototype.register = jest.fn().mockResolvedValue(false);

        const result = await service.create();
        expect(result).toBe(false);
    });

    it('should create the product successfully', async () => {
        const mockImage = {
            originalname: 'test.jpg',
            buffer: Buffer.from('test image data'),
        };

        const mockB2Instance = {
            authorize: jest.fn().mockResolvedValue({ data: { downloadUrl: 'https://example.com' } }),
            getUploadUrl: jest.fn().mockResolvedValue({
                data: {
                    authorizationToken: 'token',
                    uploadUrl: 'https://upload-url.com'
                },
            }),
            uploadFile: jest.fn().mockResolvedValue({
                data: {
                    fileId: 'file-id',
                    fileName: 'test.jpg',
                },
            }),
        };

        B2.mockImplementation(() => mockB2Instance);

        const mockRegisterProductInstance = {
            register: jest.fn().mockResolvedValue(true),
        };

        RegisterProduct.mockImplementation(() => mockRegisterProductInstance);

        const product = new CreateProduct('Test Product', mockImage, 'Test Description', '29.99', 'Test Category', 'Test Brand', '10');
        const result = await product.create();

        expect(mockB2Instance.authorize).toHaveBeenCalled();
        expect(mockB2Instance.getUploadUrl).toHaveBeenCalled();
        expect(mockB2Instance.uploadFile).toHaveBeenCalledWith({
            uploadUrl: 'https://upload-url.com',
            uploadAuthToken: 'token',
            fileName: 'products/test.jpg',
            data: mockImage.buffer,
        });

        expect(mockRegisterProductInstance.register).toHaveBeenCalled();
        expect(result).toBe(true);
    });

    it('An error should be thrown when image upload fails', async () => {
        const mockImage = {
            originalname: 'test.jpg',
            buffer: Buffer.from('test image data'),
        };

        const mockB2Instance = {
            authorize: jest.fn().mockResolvedValue({ data: { downloadUrl: 'https://example.com' } }),
            getUploadUrl: jest.fn().mockResolvedValue({ data: { authorizationToken: 'token', uploadUrl: 'https://upload-url.com' } }),
            uploadFile: jest.fn().mockRejectedValue(new Error('Upload failed')),
        };

        B2.mockImplementation(() => mockB2Instance);

        const product = new CreateProduct('Test Product', mockImage, 'Test Description', '29.99', 'Test Category', 'Test Brand', '10');

        await expect(product.create()).rejects.toThrow('Error uploading image the product: Upload failed');
    });

    it('deve lançar um erro ao falhar o upload da imagem', async () => {
        const mockImage = {
            originalname: 'test.jpg',
            buffer: Buffer.from('test image data'),
        };

        const mockB2Instance = {
            authorize: jest.fn().mockResolvedValue({ data: { downloadUrl: 'https://example.com' } }),
            getUploadUrl: jest.fn().mockResolvedValue({ data: { authorizationToken: 'token', uploadUrl: 'https://upload-url.com' } }),
            uploadFile: jest.fn().mockRejectedValue(new Error('Upload failed')),
        };

        B2.mockImplementation(() => mockB2Instance);

        const product = new CreateProduct('Test Product', mockImage, 'Test Description', '29.99', 'Test Category', 'Test Brand', '10');

        await expect(product.create()).rejects.toThrow('Error uploading image the product: Upload failed');
    });
});
