import DeviceDetector from 'device-detector-js';
// import DeviceDetector = require('device-detector-js');
import type { Request } from 'express';
import { lookup } from 'geoip-lite';
import * as countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';

import type { SessionMetadata } from '@/src/shared/types/session-metadata.types';
import { IS_DEV_ENV } from '@/src/shared/utils/is-dev/is-dev.util';

countries.registerLocale(en);

export function getSessionMetadata(
  req: Request,
  userAgent: string
): SessionMetadata {
  const devIp = '173.166.164.121'; // IP only for development, Washington. D.C.
  const headers = req.headers;
  const ip = IS_DEV_ENV
    ? devIp
    : Array.isArray(headers['cf-connecting-ip'])
      ? headers['cf-connecting-ip'][0]
      : headers['cf-connecting-ip'] ||
        (typeof headers['x-forwarded-for'] === 'string'
          ? headers['x-forwarded-for'].split(',')[0]
          : req.ip)!;

  const location = lookup(ip)!;
  const device = new DeviceDetector().parse(userAgent);

  return {
    location: {
      country: countries.getName(location?.country, 'en') || 'Undefined',
      city: location?.city || 'Undefined',
      latitude: location?.ll[0] || 0,
      longitude: location?.ll[1] || 0,
    },
    device: {
      browser: device.client?.name || 'Undefined',
      os: device.os?.name || 'Undefined',
      type: device.device?.type || 'Undefined',
    },
    ip,
  };
}
