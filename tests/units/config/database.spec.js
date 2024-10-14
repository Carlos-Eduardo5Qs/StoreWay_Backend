const mysql = require('mysql2/promise');
const Database = require('../../../src/config/Database');

jest.mock('mysql2/promise');

describe('Database Class', () => {
    let dbInstance;
    let mockConnection;

    beforeEach(() => {
        mockConnection = {
            getConnection: jest.fn(),
            end: jest.fn(),
            release: jest.fn(),
        };

        mysql.createPool.mockReturnValue(mockConnection);

        dbInstance = new Database();

        jest.clearAllMocks();
    });

    it('Should open a new connection successfuly', async () => {
        const mockPoolConnection = { release: jest.fn() };
        mockConnection.getConnection.mockResolvedValue(mockPoolConnection);

        const connection = await dbInstance.openConnection();

        expect(connection).toBe(mockPoolConnection);
        expect(mockConnection.getConnection).toHaveBeenCalled();
    });

    it('Should throw an error if opening connnnection fails', async () => {
        mockConnection.getConnection.mockRejectedValue(new Error('Connection Error'));

        await expect(dbInstance.openConnection()).rejects.toThrow('DATABASE ERROR: Connection Error');
        expect(mockConnection.getConnection).toHaveBeenCalled();
    });

    it('Should throw an error if closing connection fails', async () => {
        mockConnection.end.mockRejectedValue(new Error('Close Error'));

        await expect(dbInstance.closeConnection()).rejects.toThrow('DATABASE ERROR: Close Error');
        expect(mockConnection.end).toHaveBeenCalled();
    });

    it('Should release the connection if it exists', async () => {
        const mockPoolConnection = { release: jest.fn() };

        dbInstance.releaseConnection(mockPoolConnection);

        expect(mockPoolConnection.release).toHaveBeenCalled();
    });

    it('Should not call release if no connection is provided', () => {
        const mockPoolConnection = { release: jest.fn() };

        dbInstance.releaseConnection(null);

        expect(mockPoolConnection.release).not.toHaveBeenCalled();
    });
});
