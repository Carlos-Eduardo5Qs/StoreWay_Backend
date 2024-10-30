const SearchUser = require('../../../../src/models/users/SearchUserModel');
const Database = require('../../../../src/config/Database');

jest.mock('../../../../src/config/Database');

describe('SearchUser Model', () => {
    let searchUser;
    let mockConnection;

    beforeEach(() => {
        mockConnection = {
            execute: jest.fn().mockResolvedValue([[]]),
        };

        Database.prototype.openConnection = jest.fn().mockResolvedValue(mockConnection);
        Database.prototype.releaseConnection = jest.fn();

        searchUser = new SearchUser('test@example.com');
    });

    it('should call execute with correct SQL and parameters', async () => {
        await searchUser.find();

        expect(mockConnection.execute).toHaveBeenCalledWith(
            'SELECT * FROM user_profile WHERE email = ?',
            ['test@example.com']
        );
    });

    it('should return false if no user is found', async () => {
        const result = await searchUser.find();

        expect(result).toBe(false);
    });

    it('should return the user data if found', async () => {
        const userData = { id: 1, nick: 'testNick', user_name: 'testUser', email: 'test@example.com' };
        mockConnection.execute.mockResolvedValue([[userData]]);

        const result = await searchUser.find();

        expect(result).toEqual(userData);
    });

    it('should log an error if execute fails', async () => {
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
        mockConnection.execute.mockRejectedValue(new Error('Mocked database error'));

        await searchUser.find();

        expect(consoleLogSpy).toHaveBeenCalledWith(expect.any(String));
        consoleLogSpy.mockRestore();
    });

    it('should release the connection after executing the query', async () => {
        await searchUser.find();

        expect(Database.prototype.releaseConnection).toHaveBeenCalledWith(mockConnection);
    });
});
