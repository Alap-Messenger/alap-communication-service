export enum RedisMessageEnum {
	NESTJS_BACKEND_BOILER_PLATE = 'NESTJS_BACKEND_BOILER_PLATE',
}

export class RedisSingleMessageType<T, U> {
	payload: T;
	return: U;
}

export class MessageDataReturn {
	[RedisMessageEnum.NESTJS_BACKEND_BOILER_PLATE]: RedisSingleMessageType<any, any>;
}
