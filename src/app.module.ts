import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import config from './config';
import { MailModule } from './mail/mail.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import * as path from 'path';
import { MicroServiceClientModule } from './modules/microservice-client/microservice-client.module';

@Module({
	imports: [
		TypegooseModule.forRoot(config.mongoURL),
		MicroServiceClientModule.register(config.redisURL, config.redisPort),
		MailerModule.forRoot({
			transport: {
				host: 'smtp.gmail.com',
				auth: {
					user: 'info.alapmessenger@gmail.com',
					pass: 'foqb qnmq arlm ocsw',
				},
			},
			defaults: {
				from: 'Alap <noreply@info.alapmessenger@gmail.com>',
			},
			template: {
				dir: path.join(__dirname, './mail/templates'),
				adapter: new EjsAdapter(),
				options: {
					strict: true,
					async: true,
				},
			},
		}),
		MailModule,
	],
})
export class AppModule {}
