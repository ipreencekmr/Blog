import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { CommentCreatedListener } from './events/listeners/comment-created-listener';
import { CommentUpdatedListener } from './events/listeners/comment-updated-listener';

const start = async () => {

    console.log('Starting Post...');

    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }

    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }

    if (!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID must be defined');
    }

    if (!process.env.NATS_URL) {
        throw new Error('NATS_URL must be defined');
    }

    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS_CLUSTER_ID must be defined');
    }

    try {
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        );

        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!');
            process.exit();
        });
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        new CommentCreatedListener(natsWrapper.client).listen();
        new CommentUpdatedListener(natsWrapper.client).listen();

        await mongoose.connect(process.env.MONGO_URI);
    } catch (err) {
        console.error(err);
    }
    console.log('connected to mongo db');
    app.listen(3000, () => {
        console.log('Listening on 3000!');
    });
}

start();