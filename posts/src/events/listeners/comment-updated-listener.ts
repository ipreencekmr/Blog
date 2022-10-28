import { Message } from 'node-nats-streaming';
import { Subjects, Listener, CommentUpdatedEvent, NotFoundError } from '@learnatibm/sharedlib';
import { Comment } from '../../models/comment';
import { Post } from '../../models/post';
import { queueGroupName } from './queue-group-name';

export class CommentUpdatedListener extends Listener<CommentUpdatedEvent>{
    subject: Subjects.CommentUpdated = Subjects.CommentUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: CommentUpdatedEvent['data'], msg: Message) {
        const comment = await Comment.findByEvent(data);

        const { postId } = data;

        const post = await Post.findById(postId);

        if (!post) {
            throw new NotFoundError();
        }

        if (!comment) {
            throw new Error('Comment not found');
        }

        const { desc } = data;
        comment.set({ desc });

        await comment.save();

        const commentToUpdate = post.comments.find(object => object.id === comment.id);

        if (commentToUpdate) {
            commentToUpdate.desc = desc;
        }

        msg.ack();
    }
}