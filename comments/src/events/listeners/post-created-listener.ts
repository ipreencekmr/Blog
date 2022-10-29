import { Message } from 'node-nats-streaming';
import { Subjects, Listener, PostCreatedEvent } from '@learnatibm/sharedlib';
import { Post } from '../../models/post';
import { queueGroupName } from './queue-group-name';

export class PostCreatedListener extends Listener<PostCreatedEvent> {
    subject: Subjects.PostCreated = Subjects.PostCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: PostCreatedEvent['data'], msg: Message) {
        const { id, title, desc } = data;

        const post = Post.build({
            id,
            title,
            desc
        });

        await post.save();

        msg.ack();
    }
}