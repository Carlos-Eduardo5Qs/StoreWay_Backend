const FindUser = require('../../../../src/models/users/FindUserModel');
const Database = require('../../../../src/config/Database');

jest.mock('../../../../src/config/Database');

describe('FindUser', () => {
    let findUser;
    let mockConnection;

    beforeEach(() => {
        mockConnection = {
            execute: jest.fn().mockResolvedValue([[]]),
        };

        Database.prototype.openConnection = jest.fn().mockResolvedValue(mockConnection);
        Database.prototype.releaseConnection = jest.fn();

        findUser = new FindUser(1);
    });

    it('should call execute with correct SQL and parameters', async () => {
        await findUser.find();

        expect(mockConnection.execute).toHaveBeenCalledWith(
            'SELECT * FROM user_profile WHERE id = ?',
            [1]
        );
    });

    it('should return an empty object if no user is found', async () => {
        const result = await findUser.find();

        expect(result).toEqual({});
    });

    it('should return the user data if found', async () => {
        const userData = { id: 1, nick: 'testNick', user_name: 'testUser', email: 'test@example.com' };
        mockConnection.execute.mockResolvedValue([[userData]]);

        const result = await findUser.find();

        expect(result).toEqual(userData);
    });

    it('should log an error if execute fails', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        mockConnection.execute.mockRejectedValue(new Error('Mocked database error'));

        await findUser.find();

        expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));
        consoleErrorSpy.mockRestore();
    });

    it('should release the connection after executing the query', async () => {
        await findUser.find();

        expect(Database.prototype.releaseConnection).toHaveBeenCalledWith(mockConnection);
    });
});
