import { DynamicModule, Global, Inject, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { MessageDataReturn, RedisMessagesEnum } from './messages';

export class MicroserviceClient {
  private logger = new Logger(MicroserviceClient.name);
  constructor(@Inject('REDIS_CLIENT') private client: ClientProxy) {}

  async send<T extends RedisMessagesEnum>(
    message: T,
    data: MessageDataReturn[T]['payload'],
  ): Promise<MessageDataReturn[T]['return']> {
    try {
      return await firstValueFrom(
        this.client
          .send<MessageDataReturn[T]['return']>({ cmd: message }, data)
          .pipe(timeout(50000)),
      );
    } catch (error) {
      this.logger.error(
        `[RPC_CALL_TIMEOUT] [MESSAGE] -> [${message}] `,
        error ?? new Error().stack,
      );
    }
  }
}

@Global()
@Module({})
export class MicroServiceClientModule {
  static register(): DynamicModule {
    return {
      module: MicroServiceClientModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: 'REDIS_CLIENT',
          useFactory: (configService: ConfigService) =>
            ClientProxyFactory.create({
              transport: Transport.REDIS,
              options: {
                host: configService.getOrThrow<string>('redis.host'),
                port: configService.getOrThrow<number>('redis.port'),
              },
            }),
          inject: [ConfigService],
        },
        MicroserviceClient,
      ],
      exports: ['REDIS_CLIENT', MicroserviceClient],
    };
  }
}
