import { InjectRedis } from '@nestjs-modules/ioredis';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import * as path from 'path';
import { MailService } from 'src/mail/services/mail.service';
import { OTP_CONSTANTS } from 'src/shared/constants';
import { RedisMessagesEnum } from 'src/utils/modules/microservice-client/messages';
import { MicroserviceClient } from 'src/utils/modules/microservice-client/microservice-client.module';
import { IOtpData, IStoredOtpData } from '../interfaces/opt.interface';
import { OtpHelper } from '../otp.helper';

@Injectable()
export class OtpService {
  private readonly templatePath =
    this.configService.getOrThrow<string>('env') === 'production'
      ? path.join(
          __dirname,
          '..',
          '..',
          'mail',
          'templates',
          'otp.template.ejs',
        )
      : path.join(
          __dirname,
          '..',
          '..',
          '..',
          'src',
          'mail',
          'templates',
          'otp.template.ejs',
        );
  constructor(
    @InjectRedis() private readonly redis: Redis,
    @Inject() private readonly configService: ConfigService,
    private readonly redisClient: MicroserviceClient,
    private readonly mailService: MailService,
    private readonly otpHelper: OtpHelper,
  ) {}

  async sendOtp(data: IOtpData): Promise<string[]> {
    try {
      await this.checkRateLimit(data.email);

      const existingOtp = await this.getExistingOtp(data.email);

      if (existingOtp) {
        return ['Verification code sent. No need to request again.'];
      }
      const otp = await this.otpHelper.generateUniqueOTP();

      await this.saveOtpData(data.email, otp);

      await this.mailService.sendEmail(
        data.email,
        OTP_CONSTANTS.SUBJECT.OTP_VERIFICATION_SEND,
        this.templatePath,
        {
          fullName: data.fullName,
          otpCode: otp,
          expiresIn: this.configService.getOrThrow<number>('otp.expiry'),
        },
      );
      return [
        'Verification OTP Code Sent to your email address. Please check your mail address!',
      ];
    } catch (error) {
      throw new Error(error);
    }
  }

  async verifyOtp(email: string, submittedOtp: number): Promise<string[]> {
    try {
      const otpData = await this.getAndValidateStoredOtp(email);
      await this.validateAttempts(email, otpData);

      if (otpData.otp !== submittedOtp) {
        throw new HttpException(OTP_CONSTANTS.ERROR_MESSAGES.INVALID_CODE, 400);
      }

      await this.redis.del(this.otpHelper.getOtpKey(email));
      // await this.redisClient.send(
      //   RedisMessagesEnum.COMMUNICATION_SEND_USER_VERIFICATION_MAIL,
      //   { email },
      // );

      return ['Email verification successful!'];
    } catch (error) {
      throw new Error(error);
    }
  }

  async resendOtp(data: IOtpData): Promise<string[]> {
    try {
      const existingOtpData = await this.getExistingOtp(data.email);

      if (existingOtpData) {
        await this.resendExistingOtp(
          data.email,
          data.fullName,
          existingOtpData,
        );
        return ['Resend your OTP code. Please check your email address!'];
      }

      await this.sendNewOtp(data);
      return ['Resend your OTP code. Please check your email address!'];
    } catch (error) {
      throw new Error(error);
    }
  }

  private async getExistingOtp(email: string): Promise<IStoredOtpData | null> {
    const storedData = await this.redis.get(this.otpHelper.getOtpKey(email));
    return storedData ? JSON.parse(storedData) : null;
  }

  private async saveOtpData(email: string, otp: number): Promise<void> {
    const otpData: IStoredOtpData = {
      otp,
      attempts: 0,
      createdAt: Date.now(),
    };

    const multi = this.redis.multi();
    multi.set(
      this.otpHelper.getOtpKey(email),
      JSON.stringify(otpData),
      'EX',
      this.configService.getOrThrow<number>('otp.expiry'),
    );
    multi.incr(this.otpHelper.getRateLimitKey(email));
    multi.expire(
      this.otpHelper.getRateLimitKey(email),
      this.configService.getOrThrow<number>('otp.rateLimitTTL'),
    );

    await multi.exec();
  }

  private async checkRateLimit(email: string): Promise<void> {
    const requests = await this.redis.get(
      this.otpHelper.getRateLimitKey(email),
    );
    if (
      requests &&
      parseInt(requests) >=
        this.configService.getOrThrow<number>('otp.maxRequestsPerHour')
    ) {
      throw new HttpException(OTP_CONSTANTS.ERROR_MESSAGES.RATE_LIMIT, 429);
    }
  }

  private async getAndValidateStoredOtp(
    email: string,
  ): Promise<IStoredOtpData> {
    const storedData = await this.redis.get(this.otpHelper.getOtpKey(email));
    if (!storedData) {
      throw new Error(OTP_CONSTANTS.ERROR_MESSAGES.EXPIRED);
    }
    return JSON.parse(storedData);
  }

  private async validateAttempts(
    email: string,
    otpData: IStoredOtpData,
  ): Promise<void> {
    otpData.attempts += 1;

    if (
      otpData.attempts >=
      this.configService.getOrThrow<number>('otp.maxAttempts')
    ) {
      await this.redis.del(this.otpHelper.getOtpKey(email));
      throw new Error(OTP_CONSTANTS.ERROR_MESSAGES.MAX_ATTEMPTS);
    }

    await this.redis.set(
      this.otpHelper.getOtpKey(email),
      JSON.stringify(otpData),
      'EX',
      this.configService.getOrThrow<number>('otp.expiry'),
    );
  }

  private async resendExistingOtp(
    email: string,
    fullName: string,
    otpData: IStoredOtpData,
  ): Promise<void> {
    await this.mailService.sendEmail(
      email,
      OTP_CONSTANTS.SUBJECT.OTP_VERIFICATION_SEND,
      this.templatePath,
      {
        fullName: fullName,
        otpCode: otpData.otp,
        expiresIn: this.configService.getOrThrow<number>('otp.expiry'),
      },
    );
  }

  private async sendNewOtp(data: IOtpData): Promise<void> {
    const otp = await this.otpHelper.generateUniqueOTP();
    await this.saveOtpData(data.email, otp);
    await this.mailService.sendEmail(
      data.email,
      OTP_CONSTANTS.SUBJECT.OTP_RESEND,
      this.templatePath,
      {
        fullName: data.fullName,
        otpCode: otp,
        expiresIn: this.configService.getOrThrow<number>('otp.expiry'),
      },
    );
  }
}
