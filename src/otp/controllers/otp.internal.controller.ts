import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RedisMessagesEnum } from 'src/utils/modules/microservice-client/messages';
import { OtpService } from '../services/otp.service';

@Controller()
export class OtpInternalController {
  constructor(private readonly otpService: OtpService) {}

  @MessagePattern({
    cmd: RedisMessagesEnum.COMMUNICATION_SEND_USER_VERIFICATION_MAIL,
  })
  async sendOtp(data: { email: string }) {
    // return await this.otpService.sendOtp(data);
  }
}
