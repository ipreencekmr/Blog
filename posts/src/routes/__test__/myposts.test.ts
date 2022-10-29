import request from 'supertest';
import { app } from '../../app';
import { Post } from '../../models/post';
import { Comment } from '../../models/comment';
import mongoose from 'mongoose';

const savePostForUser = async (userId: string) => {
    const post = Post.build({
        userId: userId,
        title: 'test title',
        desc: 'test desc',
        date: new Date()
    });

    await post.save();

    const comment = Comment.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        postId: post.id,
        desc: 'test description',
        version: 0
    });

    post.set({ comments: [comment] });

    await post.save();
}

it('should throw not authorized if user is not logged in', async () => {
    await request(app)
        .get('/api/posts/myposts')
        .send()
        .expect(401);
});

it('should return post related to user', async () => {

    const userId_1 = new mongoose.Types.ObjectId().toHexString();
    const userId_2 = new mongoose.Types.ObjectId().toHexString();
    savePostForUser(userId_1);
    savePostForUser(userId_1);

    savePostForUser(userId_2);
    savePostForUser(userId_2);
    savePostForUser(userId_2);

    const postList = await request(app)
        .get('/api/posts/myposts')
        .set('Cookie', global.signin(userId_1))
        .send()
        .expect(200);

    expect(postList.body.length).toEqual(2);
});