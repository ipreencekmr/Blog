import { Post } from '../../../models/post';
import { Comment } from '../../../models/comment';

import { CommentUpdatedListener } from '../comment-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { CommentUpdatedEvent } from '@learnatibm/sharedlib';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () => {
    // create an instance of the listener
    const listener = new CommentUpdatedListener(natsWrapper.client);

    // create and save a Post 

    const post = Post.build({
        title: 'test title',
        desc: 'test desc',
        userId: new mongoose.Types.ObjectId().toHexString(),
        date: new Date()
    });

    await post.save();

    // create and save a comment
    const comment = Comment.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        postId: post.id,
        desc: 'test desc',
        version: 0
    });

    await comment.save();

    // update post to include comment and save

    post.set({ comments: [comment] });

    await post.save();

    // create the fake data event

    const data: CommentUpdatedEvent['data'] = {
        id: comment.id,
        version: 1,
        userId: new mongoose.Types.ObjectId().toHexString(),
        desc: 'update comment description',
        postId: post.id
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, post, comment, data, msg };
}

it('updates the comment of the post', async () => {
    const { listener, post, comment, data, msg } = await setup();

    await listener.onMessage(data, msg);
    const updatedPost = await Post.findById(post.id).populate('comments');
    const fetchedComment = updatedPost?.comments.find(obj => obj.id === comment.id);
    expect(fetchedComment!.desc).toEqual('update comment description');
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});
