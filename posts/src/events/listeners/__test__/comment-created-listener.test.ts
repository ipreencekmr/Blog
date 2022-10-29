import { Post } from '../../../models/post';

import { CommentCreatedListener } from '../comment-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { CommentCreatedEvent } from '@learnatibm/sharedlib';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () => {
    // create an instance of the listener
    const listener = new CommentCreatedListener(natsWrapper.client);

    // create and save a Post 

    const post = Post.build({
        title: 'test title',
        desc: 'test desc',
        userId: new mongoose.Types.ObjectId().toHexString(),
        date: new Date()
    });

    await post.save();

    // create the fake data event

    const data: CommentCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: new mongoose.Types.ObjectId().toHexString(),
        desc: 'test description',
        postId: post.id
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, post, data, msg };
}

it('sets the comment of the post', async () => {
    const { listener, post, data, msg } = await setup();

    await listener.onMessage(data, msg);
    const updatedPost = await Post.findById(post.id);
    expect(updatedPost!.comments.length).toEqual(1);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});
