import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

class ParticipantsDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	senderId: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	receiverId: string;
}

export class CreateConversationDto {
	@ApiProperty({ type: () => ParticipantsDto })
	@IsNotEmpty()
	participants: ParticipantsDto;

	@ApiProperty()
	@IsArray()
	@IsNotEmpty()
	messages: string[];
}
