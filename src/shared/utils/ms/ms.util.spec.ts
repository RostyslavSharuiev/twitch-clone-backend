import { ms, type StringValue } from './ms.util';

describe('ms', () => {
  it('should parse milliseconds correctly', () => {
    expect(ms('100ms')).toBe(100);
    expect(ms('500 millisecond')).toBe(500);
    expect(ms('250 milliseconds')).toBe(250);
    expect(ms('10 msec')).toBe(10);
    expect(ms('5 msecs')).toBe(5);
  });

  it('should parse seconds correctly', () => {
    expect(ms('1s')).toBe(1000);
    expect(ms('2 sec')).toBe(2000);
    expect(ms('3 secs')).toBe(3000);
    expect(ms('5 second')).toBe(5000);
    expect(ms('10 seconds')).toBe(10000);
  });

  it('should parse minutes correctly', () => {
    expect(ms('1m')).toBe(60 * 1000);
    expect(ms('2 min')).toBe(2 * 60 * 1000);
    expect(ms('3 mins')).toBe(3 * 60 * 1000);
    expect(ms('5 minute')).toBe(5 * 60 * 1000);
    expect(ms('10 minutes')).toBe(10 * 60 * 1000);
  });

  it('should parse hours correctly', () => {
    expect(ms('1h')).toBe(60 * 60 * 1000);
    expect(ms('2 hrs')).toBe(2 * 60 * 60 * 1000);
    expect(ms('1 hour')).toBe(60 * 60 * 1000);
    expect(ms('3 hours')).toBe(3 * 60 * 60 * 1000);
  });

  it('should parse days correctly', () => {
    expect(ms('1d')).toBe(24 * 60 * 60 * 1000);
    expect(ms('2 day')).toBe(2 * 24 * 60 * 60 * 1000);
    expect(ms('3 days')).toBe(3 * 24 * 60 * 60 * 1000);
  });

  it('should parse weeks correctly', () => {
    expect(ms('1w')).toBe(7 * 24 * 60 * 60 * 1000);
    expect(ms('2 week')).toBe(2 * 7 * 24 * 60 * 60 * 1000);
    expect(ms('3 weeks')).toBe(3 * 7 * 24 * 60 * 60 * 1000);
  });

  it('should parse years correctly', () => {
    const yearInMs = 365.25 * 24 * 60 * 60 * 1000;

    expect(ms('1y')).toBe(yearInMs);
    expect(ms('2 yr')).toBe(2 * yearInMs);
    expect(ms('3 yrs')).toBe(3 * yearInMs);
    expect(ms('1 year')).toBe(yearInMs);
    expect(ms('2 years')).toBe(2 * yearInMs);
  });

  it('should handle string numbers without explicit unit as milliseconds', () => {
    expect(ms('100')).toBe(100);
  });

  it('should handle decimal values and negative numbers', () => {
    expect(ms('1.5h')).toBe(1.5 * 60 * 60 * 1000);
    expect(ms('-10s')).toBe(-10000);
  });

  it('should handle uppercase and mixed case units', () => {
    expect(ms('10 SECONDS')).toBe(10000);
    expect(ms('1H')).toBe(3600000);
  });

  it('should return NaN for unrecognized string formats', () => {
    expect(Number.isNaN(ms('invalid' as StringValue))).toBe(true);
  });

  it('should throw an error for empty string or invalid length', () => {
    expect(() => ms('' as StringValue)).toThrow();
    expect(() => ms('a'.repeat(101) as StringValue)).toThrow();
  });
});
