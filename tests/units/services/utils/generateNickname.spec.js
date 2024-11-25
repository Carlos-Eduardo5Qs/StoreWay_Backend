const generateRandomNickname = require('../../../../src/utils/generateNickname');

describe('generateRandomNickname', () => {
    it('should return a string', () => {
      const nickname = generateRandomNickname();
      expect(typeof nickname).toBe('string');
    });
  
    it('should contain an adjective, a noun, and a number', () => {
      const nickname = generateRandomNickname();
      
      const match = nickname.match(/^([A-Za-z]+)([A-Za-z]+)(\d{1,3})$/);

      expect(match).not.toBeNull();
    });
  });
