const expect = require('expect');
const {isRealString} = require('./validation');

describe('isRealString', () => {
  it('should allow valid strings with spaces', () => {
    expect(isRealString('Beth ')).toBe(true);
  });

  it('should reject strings with only spaces', () => {
    expect(isRealString('  ')).toBe(false);
  });

  it('should reject non-strings', () => {
    expect(isRealString(5)).toBe(false);
  });
});
