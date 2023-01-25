import { some } from './math.controller';

describe('MathController', () => {
  describe('some', () => {
    it('should return a valid number', () => {
      const result = some(1, 2);
      expect(result).toBe(3);
    });
  });
});
