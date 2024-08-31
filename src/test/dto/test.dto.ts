import { ApiProperty } from '@nestjs/swagger';

export class TestDto {
	@ApiProperty()
	vendorInvoiceNo?: number;

	@ApiProperty({ example: '' })
	calculationsId: string;

	@ApiProperty()
	payeeId: string;

	@ApiProperty()
	totalPayableToVendor: number;

	@ApiProperty()
	serviceDate: string;

	@ApiProperty()
	customerNumber: string;

	@ApiProperty()
	customerName: string;

	@ApiProperty({ example: '4255RE1RR222' })
	accountNumber: string;

	@ApiProperty({ example: '' })
	transactionID?: string;

	@ApiProperty({ example: '' })
	transactionRef?: string;
}
