import { app } from '../../app';
import request from 'supertest';
import { Post } from '../../models/post';
import { Comment } from '../../models/comment';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';

const generatedId = () => {
    return new mongoose.Types.ObjectId().toHexString();
};

it('should return unauthorized if not logged in', async () => {
    await request(app)
        .post('/api/comments')
        .send({
            postId: generatedId()
        })
        .expect(401);
});

it('should return bad request if postId not provided', async () => {
    await request(app)
        .post('/api/comments')
        .set('Cookie', global.signin())
        .send({
            desc: ''
        })
        .expect(400);
});

it('should return not found if post does not exits', async () => {
    await request(app)
        .post('/api/comments')
        .set('Cookie', global.signin())
        .send({
            postId: generatedId(),
            desc: 'test description'
        })
        .expect(404);
});

it('should create comment for valid inputs', async () => {
    //create and save a post 
    const post = Post.build({
        id: generatedId(),
        title: 'test title',
        desc: 'test description'
    });

    await post.save();

    // raise request to add a comment 
    const response = await request(app)
        .post('/api/comments')
        .set('Cookie', global.signin())
        .send({
            postId: post.id,
            desc: 'test description'
        })
        .expect(201);


    // fetch comment from database and match 
    const fetchedComment = await Comment.findById(response.body.id);
    expect(fetchedComment!.desc).toEqual('test description');
});

it('should publish an event', async () => {
    //create and save a post 
    const post = Post.build({
        id: generatedId(),
        title: 'test title',
        desc: 'test description'
    });

    await post.save();

    // raise request to add a comment 
    const response = await request(app)
        .post('/api/comments')
        .set('Cookie', global.signin())
        .send({
            postId: post.id,
            desc: 'test description'
        })
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});