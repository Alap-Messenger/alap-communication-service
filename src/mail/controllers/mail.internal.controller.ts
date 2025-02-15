import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MailService } from '../services/mail.service';

@Controller()
export class MailInternalController {
  constructor(private readonly mailService: MailService) {}

  @MessagePattern({ cmd: 'COMMUNICATION_SEND_USER_VERIFICATION_MAIL' })
  async sendTestMail(data: any) {
    console.log({ data });
  }
}
