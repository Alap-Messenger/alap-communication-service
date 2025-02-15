import { Module } from '@nestjs/common';
import { GlobalConfigModule } from './config/config.module';
import { MailModule } from './mail/mail.module';
import { OtpModule } from './otp/otp.module';

@Module({
  imports: [GlobalConfigModule, MailModule, OtpModule],
})
export class AppModule {}
