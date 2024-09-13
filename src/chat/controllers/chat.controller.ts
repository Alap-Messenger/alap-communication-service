import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ChatService } from '../services/chat.service';

@ApiTags('Chat Related Operations')
@Controller('conversation')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Post('all')
	@ApiBody({
		required: true,
		schema: {
			type: 'object',
			properties: {
				id: {
					type: 'string',
				},
			},
		},
	})
	async getAllConversations(@Body('id') id: string) {
		return await this.chatService.getAllConversations(id);
	}

	@Get('/:id')
	async getMessages(@Param('id') conversationId: string) {
		return this.chatService.getConversationMessages(conversationId);
	}
}
