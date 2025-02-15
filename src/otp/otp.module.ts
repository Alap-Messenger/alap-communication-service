import { Module } from '@nestjs/common';
import { MailModule } from 'src/mail/mail.module';
import { OtpHelper } from './otp.helper';
import { OtpController } from './controllers/otp.controller';
import { OtpInternalController } from './controllers/otp.internal.controller';
import { OtpService } from './services/otp.service';

@Module({
  imports: [MailModule],
  controllers: [OtpController, OtpInternalController],
  providers: [OtpService, OtpHelper],
})
export class OtpModule {}
