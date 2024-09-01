import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MailService } from '../services/mail.service';

@Controller()
export class InternalNotificationController {
	constructor(private readonly mailService: MailService) {}

	@MessagePattern({ cmd: 'COMMUNICATION_CUSTOMER_GET_NOTIFICATIONS' })
	async getNotifications(data: any) {
		console.log({ data });
		console.log('successfully calling microservices from auth to communication service');
		return await this.mailService.sendTestMail(data);
	}
}
