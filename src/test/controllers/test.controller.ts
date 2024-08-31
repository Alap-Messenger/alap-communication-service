import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TestDto } from '../dto/test.dto';
import { TestEntity } from '../entities/test.entity';
import { ITestInterface } from '../interfaces/test.interface';
import { TestService } from '../services/test.service';

@ApiTags('Test Operations')
@ApiBearerAuth()
@UseGuards()
@Controller('test')
export class TestController {
	constructor(private readonly testService: TestService) {}

	@ApiQuery({
		name: 'page',
		example: 1,
		required: true,
	})
	@ApiQuery({
		name: 'fromDate',
		example: '',
		required: false,
	})
	@ApiQuery({
		name: 'toDate',
		example: '',
		required: false,
	})
	@ApiQuery({
		name: 'search',
		example: '',
		required: false,
	})
	@Post('test-1')
	async createStatement(@Body() body: TestDto): Promise<TestEntity> {
		return await this.testService.testStatement(body);
	}

	@ApiQuery({
		name: 'page',
		example: 1,
		required: true,
	})
	@ApiQuery({
		name: 'fromDate',
		example: '',
		required: false,
	})
	@ApiQuery({
		name: 'toDate',
		example: '',
		required: false,
	})
	@ApiQuery({
		name: 'search',
		example: '',
		required: false,
	})
	@Get('test-2')
	async paymentHistoryList(): Promise<ITestInterface> {
		const doc = await this.testService.testPaymentHistoryList();
		return doc;
	}
}
