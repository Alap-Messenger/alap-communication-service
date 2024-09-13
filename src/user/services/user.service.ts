import { Injectable } from '@nestjs/common';
import { RedisMessages } from 'src/modules/microservice-client/messages';
import { MicroserviceClient } from 'src/modules/microservice-client/microservice-client.module';

@Injectable()
export class UserService {
	constructor(private redis: MicroserviceClient) {}
	async getAllUserExceptLoginUser({ id }: { id: string }): Promise<any> {
		const users = await this.redis.send(RedisMessages.AUTH_GET_ALL_USERS_EXCEPT_LOGEDIN_USER, { id });
		return users;
	}
	async getUserDetails(id: string): Promise<any> {
		const users = await this.redis.send(RedisMessages.AUTH_GET_SINGLE_USER_DETAILS, { id });
		return users;
	}
}
