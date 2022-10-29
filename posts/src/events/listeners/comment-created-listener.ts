import { Message } from 'node-nats-streaming';
import { Subjects, Listener, CommentCreatedEvent, NotFoundError } from '@learnatibm/sharedlib';
import { Comment } from '../../models/comment';
import { Post } from '../../models/post';
import { queueGroupName } from './queue-group-name';

export class CommentCreatedListener extends Listener<CommentCreatedEvent> {

    subject: Subjects.CommentCreated = Subjects.CommentCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: CommentCreatedEvent['data'], msg: Message) {
        const { id, postId, desc, version } = data;

        const post = await Post.findById(postId);

        if (!post) {
            throw new NotFoundError();
        }

        const comment = Comment.build({
            id,
            postId,
            desc,
            version
        });

        const comments = post.comments;
        comments.push(comment);

        post.set({
            comments: comments
        });

        await post.save();

        await comment.save();

        msg.ack()
    }
}