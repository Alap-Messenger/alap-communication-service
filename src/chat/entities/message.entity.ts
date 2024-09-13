import { ModelOptions, prop, Ref } from '@typegoose/typegoose';
import { Conversation } from './conversation.entity';

@ModelOptions({
	schemaOptions: {
		collection: 'messages',
		timestamps: true,
	},
})
export class Message {
	@prop({ type: String, required: true })
	senderId: string;

	@prop({ required: true, type: String })
	receiverId: string;

	@prop({ ref: () => Conversation, required: true })
	conversationId!: Ref<Conversation>;

	@prop({ required: true })
	content: string;

	@prop({ default: Date.now })
	timestamp: Date;

	@prop({ default: false })
	isRead: boolean;
}
