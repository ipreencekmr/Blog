import { Post } from '../../../models/post';
import { PostCreatedListener } from '../post-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { PostCreatedEvent } from '@learnatibm/sharedlib';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () => {
    // create an instance of the listener
    const listener = new PostCreatedListener(natsWrapper.client);

    // create the fake data event
    const data: PostCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: new mongoose.Types.ObjectId().toHexString(),
        title: 'test title',
        desc: 'test description',
        date: new Date()
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg };
}

it('inserts post into collection', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    const post = await Post.findById(data.id);
    expect(post!.title).toEqual(data.title);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});
