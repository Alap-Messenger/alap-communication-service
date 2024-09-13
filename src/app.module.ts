import { RedisModule } from '@nestjs-modules/ioredis';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import * as path from 'path';
import config from './config';
import { MicroServiceClientModule } from './modules/microservice-client/microservice-client.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		TypegooseModule.forRoot(config.mongoURL),
		MicroServiceClientModule.register(config.redisHost, config.redisPort),
		ConfigModule.forRoot({ isGlobal: true }),
		RedisModule.forRoot({
			type: 'single',
			url: config.redisURL,
		}),
		MailerModule.forRoot({
			transport: {
				host: config.smtpHost,
				auth: {
					user: config.smtpUser,
					pass: config.smtpPass,
				},
			},
			defaults: {
				from: `Alap <noreply@${config.smtpFrom}>`,
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
		AuthModule,
		UserModule,
		MailModule,
		ChatModule,
	],
})
export class AppModule {}
