import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { OTP_CONSTANTS } from 'src/shared/constants';

@Injectable()
export class OtpHelper {
  constructor(@Inject() private readonly configService: ConfigService) {}
  async generateUniqueOTP(
    length: number = this.configService.getOrThrow<number>('otp.length'),
  ): Promise<number> {
    try {
      const max = Math.pow(10, length);
      const min = Math.pow(10, length - 1);

      return await new Promise<number>((resolve, reject) => {
        crypto.randomInt(min, max, (err, n) => {
          if (err) reject(err);
          resolve(n);
        });
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  getOtpKey(email: string): string {
    return `${OTP_CONSTANTS.REDIS_PREFIX.OTP}${email.toLowerCase()}`;
  }

  getRateLimitKey(email: string): string {
    return `${OTP_CONSTANTS.REDIS_PREFIX.RATE_LIMIT}${email.toLowerCase()}`;
  }
}
