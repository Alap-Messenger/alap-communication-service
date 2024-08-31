import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypegooseModule } from 'nestjs-typegoose';
import config from './config';
import { MicroServiceModule } from './globals/microServiceModule';
import { TestModule } from './test/test.module';

@Module({
	imports: [
		ScheduleModule.forRoot(),
		HttpModule.register({
			timeout: 5000,
			maxRedirects: 5,
		}),
		TypegooseModule.forRoot(config.mongoURL),
		// MailerModule.forRoot({
		// 	transport: {
		// 		host: config.email.smtp.host,
		// 		port: config.email.smtp.port,
		// 		secure: config.email.smtp.port === 465, // true for port 465, false for other ports
		// 		auth: {
		// 			user: config.email.smtp.auth.user,
		// 			pass: config.email.smtp.auth.pass,
		// 		},
		// 	},
		// 	defaults: {
		// 		from: config.email.from,
		// 	},
		// 	template: {
		// 		dir: path.join(__dirname, './email/assets/email_templates'),
		// 		adapter: new EjsAdapter(),
		// 		options: {
		// 			strict: true,
		// 		},
		// 	},
		// }),
		MicroServiceModule.register(config.redisURL),
		TestModule,
	],
})
export class AppModule {}
