/* eslint-disable indent */
import { Injectable, Logger } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { TestDto } from '../dto/test.dto';
import { TestEntity } from '../entities/test.entity';
import { ITestInterface } from '../interfaces/test.interface';

@Injectable()
export class TestService {
	private logger = new Logger();
	constructor(
		@InjectModel(TestEntity)
		private readonly testModel: ReturnModelType<typeof TestEntity>,
	) {}

	async testStatement(body: TestDto): Promise<TestEntity> {
		return {
			body,
		};
	}

	async testPaymentHistoryList(): Promise<ITestInterface> {
		return {
			message: 'test message',
		};
	}
}
