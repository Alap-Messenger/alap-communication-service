import { prop } from '@typegoose/typegoose';

export enum TestList {
	ALL = 'ALL',
	EPHARMA = 'EPHARMA',
	AMAR_LAB = 'AMAR_LAB',
	GREEN_DELTA = 'GREEN_DELTA',
	THYROCARE = 'THYROCARE',
	NO_PROVIDER = 'NO_PROVIDER',
}

export enum PaymentMethod {
	BANK = 'BANK',
	CASH = 'CASH',
}

// @plugin(AutoIncrementID, { startAt: 10000, field: 'invoiceNo' })
export class TestEntity {
	@prop()
	body: any;
}
