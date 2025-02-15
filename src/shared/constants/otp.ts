export const OTP_CONSTANTS = {
  REDIS_PREFIX: {
    OTP: 'otp_',
    RATE_LIMIT: 'otp_limit_',
  },
  ERROR_MESSAGES: {
    RATE_LIMIT: 'Too many requests. Please try again later.',
    EXPIRED: 'The code has expired. Please resend the code.',
    MAX_ATTEMPTS:
      'Too many incorrect verification attempts. Please try again later.',
    INVALID_CODE: 'Invalid code. Please check the code and try again.',
    VERIFY_FAILED: 'Failed to verify OTP',
    GENERATE_FAILED: 'Failed to generate OTP',
    RESEND_FAILED: 'Failed to resend OTP!',
  },
  SUBJECT: {
    OTP_RESEND: 'Resend your OTP code.',
    OTP_VERIFICATION_SEND: 'Verify your OTP code.',
  },
};
