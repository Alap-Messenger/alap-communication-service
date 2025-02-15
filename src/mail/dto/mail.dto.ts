import { ApiProperty } from '@nestjs/swagger';

export class SendEmailDto {
  @ApiProperty({
    description: 'Recipient email address',
    example: 'user@example.com',
  })
  to: string;

  @ApiProperty({
    description: 'Email subject',
    example: 'Your OTP Code',
  })
  subject: string;

  @ApiProperty({
    description: 'Email content (raw HTML or path to an EJS template file)',
    example:
      '<h3>Hi, John</h3><p>Your OTP code is: <strong>123456</strong></p>',
  })
  content: string;

  @ApiProperty({
    description: 'Sender email address (optional)',
    example: 'noreply@example.com',
    required: false,
  })
  from?: string;

  @ApiProperty({
    description: 'Data to pass to the EJS template (optional)',
    example: { userName: 'John', otpCode: '123456' },
    required: false,
  })
  context?: Record<string, any>;
}
