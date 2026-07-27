import { ConfigService } from '@nestjs/config';

import { IS_DEV_ENV, isDev } from './is-dev.util';

describe('isDev', () => {
  let getOrThrow: jest.Mock;
  let configService: ConfigService;

  beforeEach(() => {
    getOrThrow = jest.fn();
    configService = {
      getOrThrow,
    } as unknown as ConfigService;
  });

  it('should return true when NODE_ENV is "development"', () => {
    getOrThrow.mockReturnValue('development');

    expect(isDev(configService)).toBe(true);
    expect(getOrThrow).toHaveBeenCalledWith('NODE_ENV');
  });

  it('should return false when NODE_ENV is "production"', () => {
    getOrThrow.mockReturnValue('production');

    expect(isDev(configService)).toBe(false);
    expect(getOrThrow).toHaveBeenCalledWith('NODE_ENV');
  });

  it('should export IS_DEV_ENV as a boolean', () => {
    expect(typeof IS_DEV_ENV).toBe('boolean');
  });
});
