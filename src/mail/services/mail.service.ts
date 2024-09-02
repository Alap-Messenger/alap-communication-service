import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
	constructor(private mailerService: MailerService) {}

	async sendMail(data?: any) {
		try {
			await this.mailerService.sendMail({
				to: 'faruk@zaynaxhealth.com',
				cc: 'zaynax.mukut@gmail.com',
				subject: 'zDrop Wholesell request',
				html: `
                <h1>
                ${data.rfqNo}
            </h1>
        
            <p>Name:${data.name}</p>
            <p>Mobile Number: ${data.phoneNo}</p>
            <p>Email: ${data.email}</p>
            <p>Company Name: ${data.companyName}</p>
            <p>Message: ${data.message}</p>
            <p>Attachment: <a href=${data.uploadedFile}>Open Attachment</a></p>   

                `, // HTML body content
			});
		} catch (error) {
			console.log(error);
		}
	}

	async sendTestMail(data: any) {
		try {
			const response = await this.mailerService.sendMail({
				to: `${data?.email}`,
				subject: 'Activate your account.',
				html: `<h3>Hi, ${data?.userName}</h3>
				<p>Please verify your user account by clicking the link below:</p>
                   <a href="http://localhost:3000/auth/account-verification?email=${data?.email}&token=${data?.verificationToken}&accounttype=${data?.accountType}">Verify Account</a>
                   <p>This link is valid for 24 hours.</p>
				`,
			});
			return response;
		} catch (error) {
			console.log(error);
		}
	}
}
