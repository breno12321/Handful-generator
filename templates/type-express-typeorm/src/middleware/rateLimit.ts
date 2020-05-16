import slowDown from 'express-slow-down';
import rateLimit from 'express-rate-limit';
import { revokeToken } from '../helpers/jwtHelper';

export const apiLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message:
    'Too many accounts created from this IP, please try again after an hour',
  onLimitReached(req) {
    const token = req.headers['x-api-key'] as string;
    revokeToken(token);
  },
});

export const authLimit = slowDown({
  windowMs: 2 * 60 * 1000, // 2 minutes
  delayAfter: 50, // allow 50 requests per 2 minutes, then...
  delayMs: 100, // begin adding 100ms of delay per request above 50:
});

// CHOOSE IF YOU WANT TO CUT OR JUST SLOW DOWN REQUESTS

// export default slowDown({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   delayAfter: 5, // allow 5 requests to go at full-speed, then...
//   delayMs: 100 // 6th request has a 100ms delay, 7th has a 200ms delay, 8th gets 300ms, etc.
// });
