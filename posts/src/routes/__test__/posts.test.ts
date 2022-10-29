import request from 'supertest';
import { app } from '../../app';
import { Post } from '../../models/post';
import { Comment } from '../../models/comment';
import mongoose from 'mongoose';

it('returns post list', async () => {
    const post = Post.build({
        userId: global.signin()[0],
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

    const postList = await request(app)
        .get('/api/posts')
        .send()
        .expect(200);

    expect(postList.body.length).toEqual(1);
});