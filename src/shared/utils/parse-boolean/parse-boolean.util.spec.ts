import { parseBoolean } from './parse-boolean.util';

describe('parseBoolean', () => {
  it('should return true for string "true" regardless of case and surrounding whitespace', () => {
    expect(parseBoolean('true')).toBe(true);
    expect(parseBoolean('TRUE')).toBe(true);
    expect(parseBoolean(' True ')).toBe(true);
  });

  it('should return false for string "false" regardless of case and surrounding whitespace', () => {
    expect(parseBoolean('false')).toBe(false);
    expect(parseBoolean('FALSE')).toBe(false);
    expect(parseBoolean(' False ')).toBe(false);
  });

  it('should return boolean input as is', () => {
    expect(parseBoolean(true as unknown as string)).toBe(true);
    expect(parseBoolean(false as unknown as string)).toBe(false);
  });

  it('should throw an error for invalid boolean string representations', () => {
    expect(() => parseBoolean('invalid')).toThrow();
    expect(() => parseBoolean('1')).toThrow();
    expect(() => parseBoolean('0')).toThrow();
    expect(() => parseBoolean('')).toThrow();
  });
});
