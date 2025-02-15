import * as dotenv from 'dotenv';
dotenv.config();

type IOtpConfig = {
  length: number;
  expiry: number;
  resendTime: number;
  maxAttempts: number;
  rateLimitTTL: number;
  maxRequestsPerHour: number;
};

const {
  OTP_LENGTH,
  OTP_EXPIRY,
  OTP_RESEND_TIME,
  MAX_ATTEMPTS,
  RATE_LIMIT_TTL,
  MAX_REQUESTS_PER_HOUR,
} = process.env;

export default () => ({
  otp: {
    length: parseInt(OTP_LENGTH, 10),
    expiry: parseInt(OTP_EXPIRY, 10),
    resendTime: parseInt(OTP_RESEND_TIME, 10),
    maxAttempts: parseInt(MAX_ATTEMPTS, 10),
    rateLimitTTL: parseInt(RATE_LIMIT_TTL, 10),
    maxRequestsPerHour: parseInt(MAX_REQUESTS_PER_HOUR, 10),
  } satisfies IOtpConfig,
});
