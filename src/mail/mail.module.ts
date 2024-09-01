import { Module } from '@nestjs/common';
import { MailService } from './services/mail.service';
import { MailController } from './controllers/mail.controller';
import { InternalMailController } from './controllers/mail.internal.controller';

@Module({
	providers: [MailService],
	controllers: [MailController, InternalMailController],
})
export class MailModule {}
