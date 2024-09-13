import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	senderId: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	receiverId: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	conversationId: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	content: string;
}
