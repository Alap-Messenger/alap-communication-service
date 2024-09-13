import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MailService } from '../services/mail.service';

@ApiTags('Email Related Operations')
@Controller('email')
export class MailController {
	constructor(private readonly mailService: MailService) {}

	@Get('send')
	async sendMail(): Promise<any> {
		return await this.mailService.sendMail('12141');
	}

	@Post('send-test-mail')
	async senTestMail(@Body() body?: any): Promise<any> {
		return await this.mailService.sendTestMail(body);
	}
}
