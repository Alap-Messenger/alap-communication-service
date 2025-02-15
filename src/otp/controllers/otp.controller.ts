import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OtpService } from '../services/otp.service';
import { ResendOtpDto, SendOtpDto, VerifyOtpDto } from '../dto/verify-otp.dto';
import { IOtpResponse } from '../interfaces/opt.interface';

@ApiTags('Otp Related Operations')
@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('send')
  @ApiOperation({ summary: 'Send OTP code' })
  @ApiResponse({ status: 200, description: 'OTP send successfully' })
  @ApiResponse({
    status: 400,
    description: 'OTP send failed!',
  })
  async sendOtp(@Body() data: SendOtpDto): Promise<string[]> {
    return await this.otpService.sendOtp(data);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify OTP code' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid OTP or verification failed',
  })
  async verifyOtp(@Body() data: VerifyOtpDto): Promise<string[]> {
    return await this.otpService.verifyOtp(data?.email, data?.otpCode);
  }

  @Post('resend')
  @ApiOperation({ summary: 'Resend OTP code' })
  @ApiResponse({ status: 200, description: 'OTP resent successfully' })
  @ApiResponse({ status: 400, description: 'Failed to resend OTP' })
  async resendOtp(@Body() data: ResendOtpDto): Promise<string[]> {
    return await this.otpService.resendOtp(data);
  }
}
