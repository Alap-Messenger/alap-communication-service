import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './app.config';
import databaseConfig from './database.config';
import redisConfig from './redis.config';
import { RedisModule } from '@nestjs-modules/ioredis';
import { MongooseModule } from '@nestjs/mongoose';
import { MicroServiceClientModule } from 'src/utils/modules/microservice-client/microservice-client.module';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import * as path from 'path';
import mailerConfig from './mailer.config';
import otpConfig from './otp.config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, redisConfig, mailerConfig, otpConfig],
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('mongoDb.url'),
      }),
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url: configService.getOrThrow<string>('redis.url'),
      }),
      inject: [ConfigService],
    }),
    MicroServiceClientModule.register(),
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.getOrThrow<string>('smtp.host'),
          port: configService.getOrThrow<number>('smtp.port'),
          secure: configService.getOrThrow<boolean>('smtp.secure'),
          auth: {
            user: configService.getOrThrow<string>('smtp.auth.user'),
            pass: configService.getOrThrow<string>('smtp.auth.pass'),
          },
        },
        defaults: {
          from: `Alap <noreply@${configService.getOrThrow<string>('smtp.from')}>`,
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
      inject: [ConfigService],
    }),
  ],
})
export class GlobalConfigModule {}
