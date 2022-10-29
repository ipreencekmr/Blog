import { app } from '../../app';
import request from 'supertest';
import mongoose from 'mongoose';
import { Comment } from '../../models/comment';

const generateId = () => {
    return new mongoose.Types.ObjectId().toHexString();
};

const signedRequest = (commentId?: string, userId?: string) => {
    return request(app)
        .get(`/api/comments/${commentId || generateId()}`)
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
        .get(`/api/comments/${generateId()}`)
        .send()
        .expect(401);
});

it('should return bad request if commentId is not valid', async () => {
    await signedRequest('myinvalidcommentId')
        .send()
        .expect(400);
});

it('should return not found if comment is not available', async () => {
    await signedRequest()
        .send()
        .expect(404);
});

it('should return comment detail if available', async () => {
    const { comment } = await setupComment();
    const response = await signedRequest(comment.id)
        .send()
        .expect(200);

    expect(response.body.desc).toEqual(comment.desc);
});