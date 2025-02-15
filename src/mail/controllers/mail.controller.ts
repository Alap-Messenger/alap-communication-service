import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MailService } from '../services/mail.service';
import { SendEmailDto } from '../dto/mail.dto';

@ApiTags('Email Related Operations')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  @ApiOperation({
    summary: 'Send an email',
    description: 'Send an email using raw HTML or an EJS template.',
  })
  @ApiBody({
    type: SendEmailDto,
    description:
      'Email details including recipient, subject, content, and optional sender/template data.',
  })
  @ApiResponse({
    status: 200,
    description: 'Email sent successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Invalid input data.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error. Failed to send email.',
  })
  async senTestMail(@Body() body: any): Promise<void> {
    const { to, subject, content, context } = body;
    return await this.mailService.sendEmail(to, subject, content, context);
  }
}
