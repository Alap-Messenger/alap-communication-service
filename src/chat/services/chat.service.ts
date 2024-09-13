import { HttpException, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { RedisMessages } from 'src/modules/microservice-client/messages';
import { MicroserviceClient } from 'src/modules/microservice-client/microservice-client.module';
import { Conversation } from '../entities/conversation.entity';
import { Message } from '../entities/message.entity';

@Injectable()
export class ChatService {
	constructor(
		@InjectModel(Message)
		private readonly messageModel: ReturnModelType<typeof Message>,
		@InjectModel(Conversation)
		private readonly conversationModel: ReturnModelType<typeof Conversation>,
		private readonly redis: MicroserviceClient,
	) {}

	async getAllConversations(id: string): Promise<any> {
		const conversations = await this.conversationModel
			.find({
				$or: [{ 'participants.senderId': id }, { 'participants.receiverId': id }],
			})
			.sort({ createdAt: -1 });

		if (!conversations.length) {
			throw new HttpException('No conversations found!', 404);
		}

		const participantIds = new Set<string>();
		conversations.forEach((conversation) => {
			participantIds.add(conversation.participants.senderId);
			participantIds.add(conversation.participants.receiverId);
		});

		const participantDetails = await this.redis.send(RedisMessages.AUTH_GET_PARTICIPANTS_DETAILS, {
			participantIds: Array.from(participantIds),
		});

		const conversationDetailsPromises = conversations.map(async (conversation) => {
			const { senderId, receiverId } = conversation.participants;

			const latestMessage = await this.messageModel
				.findOne({ conversationId: conversation._id })
				.sort({ timestamp: -1 })
				.exec();

			return {
				sender: participantDetails[senderId],
				receiver: participantDetails[receiverId],
				conversationId: conversation._id,
				message: {
					senderId: latestMessage?.senderId,
					receiverId: latestMessage?.receiverId,
					status: latestMessage?.isRead,
					content: latestMessage ? latestMessage.content : null,
					time: latestMessage?.timestamp,
				},
			};
		});

		const conversationDetails = await Promise.all(conversationDetailsPromises);

		return conversationDetails;
	}

	async getConversationMessages(conversationId: string) {
		const doc = await this.conversationModel.findById(conversationId).populate('messages').exec();

		if (!doc) {
			throw new HttpException('Conversation not found', 404);
		}

		const participantDetails = await this.redis.send(
			RedisMessages.AUTH_GET_PARTICIPANTS_DETAILS_FOR_CONVERSATION,
			doc.participants,
		);

		const conversationDetails = {
			conversationId: doc._id,
			participants: {
				sender: participantDetails.find((p: any) => p._id === doc.participants.senderId),
				receiver: participantDetails.find((p: any) => p._id === doc.participants.receiverId),
			},
			messages: doc.messages,
			lastUpdated: doc.lastUpdated,
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		};

		return conversationDetails;
	}
}
