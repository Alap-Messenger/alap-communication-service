import { Body, Controller, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { TestService } from '../services/test.service';
import { TestDto } from '../dto/test.dto';
import { TestEntity } from '../entities/test.entity';

@Controller()
export class TestInternalController {
	constructor(
		@Inject('MICRO_SERVICE') private readonly redis: ClientProxy,
		private readonly testService: TestService,
	) {}

	@MessagePattern({ cmd: 'NESTJS_BACKEND_BOILER_PLATE' })
	async checkUserBalanceAndPackageForCall(@Body() body: TestDto): Promise<TestEntity> {
		return { body };
	}
}
