import { Message } from 'node-nats-streaming';
import { Subjects, Listener, PostUpdatedEvent } from '@learnatibm/sharedlib';
import { Post } from '../../models/post';
import { queueGroupName } from './queue-group-name';

export class PostUpdatedListener extends Listener<PostUpdatedEvent> {
    subject: Subjects.PostUpdated = Subjects.PostUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: PostUpdatedEvent['data'], msg: Message) {
        const { id, title, desc } = data;

        const post = await Post.findById(id);

        if (!post) {
            throw new Error('Post not found');
        }

        post.set({ title, desc });

        await post.save();

        msg.ack()
    }
}