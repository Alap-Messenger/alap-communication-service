import * as dotenv from 'dotenv';
dotenv.config();

const { SMTP_FROM, SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_PORT } = process.env;

export default () => ({
  smtp: {
    from: SMTP_FROM,
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT, 10),
    secure: SMTP_PORT === '465',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  },
});
