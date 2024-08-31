import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypegooseModule } from 'nestjs-typegoose';
import config from '../config';
import { TestController } from './controllers/test.controller';
import { TestService } from './services/test.service';
import { TestEntity } from './entities/test.entity';

@Module({
	imports: [
		ClientsModule.register([
			{
				name: 'MICRO_SERVICE',
				transport: Transport.REDIS,
				options: {
					url: config.redisURL,
				} as any,
			},
		]),
		TypegooseModule.forFeature([TestEntity]),
	],
	controllers: [TestController],
	providers: [TestService],
})
export class TestModule {}
