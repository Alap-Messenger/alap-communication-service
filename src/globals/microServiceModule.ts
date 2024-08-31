import { DynamicModule, Global, HttpException, Inject, Logger, Module } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { MessageDataReturn, RedisMessageEnum } from './messages';

export class MicroServiceClient {
	private logger = new Logger(MicroServiceClient.name);
	constructor(@Inject('REDIS_CLIENT') private client: ClientProxy) {}

	async send<T extends RedisMessageEnum>(
		message: T,
		data: MessageDataReturn[T]['payload'],
	): Promise<MessageDataReturn[T]['return']> {
		try {
			return await firstValueFrom(
				this.client.send<MessageDataReturn[T]['return']>({ cmd: message }, data).pipe(timeout(70000)),
			);
		} catch (error) {
			this.logger.error(`[RPC_CALL_TIMEOUT] [MESSAGE] -> [${message}] `, error.stack ?? new Error().stack);
			throw new HttpException('Internal Server Error', 500);
		}
	}
}

@Global()
@Module({})
export class MicroServiceModule {
	static register(redisURL: string): DynamicModule {
		return {
			module: MicroServiceModule,
			providers: [
				{
					provide: 'REDIS_CLIENT',
					useValue: ClientProxyFactory.create({
						transport: Transport.REDIS,
						options: {
							url: redisURL,
							//auth_pass:"hQuCp3K5Z3W75&VVYH8E$LDwX"
						},
					} as any),
				},
				MicroServiceClient,
			],
			exports: ['REDIS_CLIENT', MicroServiceClient],
		};
	}
}
