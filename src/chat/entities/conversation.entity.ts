import { ModelOptions, prop, Ref } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Message } from './message.entity';

class Participants {
	@prop({ type: String, required: true })
	senderId: string;

	@prop({ required: true, type: String })
	receiverId: string;
}

@ModelOptions({
	schemaOptions: {
		collection: 'conversations',
		timestamps: true,
	},
})
export class Conversation extends TimeStamps {
	@prop({ required: true, _id: false })
	participants: Participants;

	@prop({ ref: () => Message, default: [] })
	messages!: Ref<Message>[];

	@prop({ default: Date.now() })
	lastUpdated: Date;
}
