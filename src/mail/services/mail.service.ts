import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';

@Injectable()
export class MailService {
  constructor(@Inject() private mailerService: MailerService) {}

  async sendEmail(
    to: string,
    subject: string,
    content: string,
    context?: Record<string, any>,
  ): Promise<void> {
    try {
      let emailContent: string;

      if (content.endsWith('.ejs')) {
        const templatePath = path.resolve(__dirname, content);
        const template = fs.readFileSync(templatePath, 'utf8');
        emailContent = ejs.render(template, context);
      } else {
        emailContent = content;
      }

      const mailOptions: any = {
        to,
        subject,
        html: emailContent,
      };

      await this.mailerService.sendMail(mailOptions);
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}
