import { app } from '../../app';
import request from 'supertest';
import { Comment } from '../../models/comment';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';

const generateId = () => {
    return new mongoose.Types.ObjectId().toHexString();
};

const signedRequest = (commentId?: string, userId?: string) => {
    return request(app)
        .post(`/api/comments/${commentId || generateId()}`)
        .set('Cookie', userId ? global.signin(userId) : global.signin());
};

const setupComment = async (userId?: string) => {
    const comment = Comment.build({
        userId: userId || generateId(),
        postId: generateId(),
        desc: 'Comment Desc',
        date: new Date()
    });

    await comment.save();

    return { comment };
};

it('should return unauthorized if not logged in', async () => {
    await request(app)
        .post(`/api/comments/${generateId()}`)
        .send({
            postId: generateId(),
            desc: 'test description to be updated'
        })
        .expect(401);
});

it('should return bad request if either of postId or desc has not provided', async () => {
    await signedRequest()
        .send({
            postId: generateId()
        })
        .expect(400);

    await signedRequest()
        .send({
            desc: 'test description'
        })
        .expect(400);
});

it('should return not found if comment is not in the database', async () => {
    await signedRequest()
        .send({
            postId: generateId(),
            desc: 'desc to be updated'
        })
        .expect(404);
});

it('should return unauthorized if comment does not belong to user', async () => {
    const { comment } = await setupComment();
    await signedRequest(comment.id)
        .send({
            postId: comment.postId,
            desc: 'comment to be updated'
        })
        .expect(401);
});

it('should update comment with valid inputs and authorised user', async () => {
    const userId = generateId();
    const { comment } = await setupComment(userId);
    await signedRequest(comment.id, userId)
        .send({
            postId: comment.postId,
            desc: 'comment to be updated'
        })
        .expect(200);

    const updatedComment = await Comment.findById(comment.id);
    expect(updatedComment!.desc).toEqual('comment to be updated');
});

it('should publish an comment updated event', async () => {
    const userId = generateId();
    const { comment } = await setupComment(userId);
    await signedRequest(comment.id, userId)
        .send({
            postId: comment.postId,
            desc: 'comment to be updated'
        })
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

