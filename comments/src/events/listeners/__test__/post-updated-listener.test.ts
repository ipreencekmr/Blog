import { Post } from '../../../models/post';
import { PostUpdatedListener } from '../post-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { PostUpdatedEvent } from '@learnatibm/sharedlib';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () => {
    // create an instance of the listener
    const listener = new PostUpdatedListener(natsWrapper.client);

    // create and save post 
    const post = Post.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'post title',
        desc: 'post description'
    });

    await post.save();

    // create the fake data event
    const data: PostUpdatedEvent['data'] = {
        id: post.id,
        version: 0,
        userId: new mongoose.Types.ObjectId().toHexString(),
        title: 'update test title',
        desc: 'update test description',
        date: new Date()
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg };
}

it('updates post with updated title and desc', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    const post = await Post.findById(data.id);
    expect(post!.title).toEqual(data.title);
    expect(post!.desc).toEqual(data.desc);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});
