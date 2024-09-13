import { Module } from '@nestjs/common';
import { ChatService } from './services/chat.service';
import { ChatController } from './controllers/chat.controller';
import { ChatGateway } from './getways/chat.gateway';
import { TypegooseModule } from 'nestjs-typegoose';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';

@Module({
	imports: [TypegooseModule.forFeature([Conversation, Message])],
	controllers: [ChatController],
	providers: [ChatService, ChatGateway],
})
export class ChatModule {}
