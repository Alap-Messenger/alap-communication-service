import { InjectModel } from 'nestjs-typegoose';
import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Message } from '../entities/message.entity';
import { ReturnModelType } from '@typegoose/typegoose';
import { Conversation } from '../entities/conversation.entity';

@WebSocketGateway({
	cors: {
		origin: '*',
	},
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;
	constructor(
		@InjectModel(Message) private readonly messageModel: ReturnModelType<typeof Message>,
		@InjectModel(Conversation)
		private readonly conversationModel: ReturnModelType<typeof Conversation>,
	) {}

	handleConnection(client: Socket) {
		console.log(`Client connected: ${client.id}`);
	}

	handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
	}

	@SubscribeMessage('send_message')
	async handleMessage(
		client: Socket,
		payload: { senderId: string; receiverId: string; content: string },
	): Promise<void> {
		let conversation = await this.conversationModel.findOne({
			$or: [
				{
					'participants.senderId': payload.senderId,
					'participants.receiverId': payload.receiverId,
				},
				{
					'participants.senderId': payload.receiverId,
					'participants.receiverId': payload.senderId,
				},
			],
		});

		if (!conversation) {
			conversation = await this.conversationModel.create({
				participants: { senderId: payload.senderId, receiverId: payload.receiverId },
				messages: [],
				lastUpdated: new Date(),
			});
		}

		const message = await this.messageModel.create({
			senderId: payload.senderId,
			receiverId: payload.receiverId,
			conversationId: conversation._id,
			content: payload.content,
			timestamp: new Date(),
		});

		conversation.messages.push(message._id);
		conversation.lastUpdated = new Date();
		await conversation.save();

		this.server.to(conversation._id.toString()).emit('receive_message', message);
	}
}
