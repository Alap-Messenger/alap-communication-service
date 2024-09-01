import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
	constructor(private mailerService: MailerService) {}

	async sendMail(data?: any) {
		try {
			await this.mailerService.sendMail({
				to: 'faruk@zaynaxhealth.com', // list of receivers
				cc: 'zaynax.mukut@gmail.com',
				subject: 'zDrop Wholesell request', // Subject line// plaintext body
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
			await this.mailerService.sendMail({
				to: `${data?.email}`,
				subject: 'Test mail. Checking microservice is working or not',
				html: `<h1>Hi, ${data?.userName}</h1>`,
			});
		} catch (error) {
			console.log(error);
		}
	}
}
