import { Module } from '@nestjs/common';
import { MailService } from './services/mail.service';
import { MailController } from './controllers/mail.controller';
import { MailInternalController } from './controllers/mail.internal.controller';

@Module({
  controllers: [MailController, MailInternalController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
