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

        const post = await Post.findById(postId).populate('comments');

        if (!post) {
            throw new NotFoundError();
        }

        if (!comment) {
            throw new Error('Comment not found');
        }

        const { desc } = data;
        comment.set({ desc });

        const comments = post.comments;

        console.log('comment.id: ' + comment.id);

        const index = comments.findIndex(object => object.id === comment.id);

        console.log('found index: ' + index);

        if (comments.length >= 0) {
            comments.splice(index, 1, comment);
        }

        post.set({
            comments: comments
        });

        await post.save();

        await comment.save();

        msg.ack();
    }
}