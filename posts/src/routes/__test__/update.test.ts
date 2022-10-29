import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 404 if provided id does not exists', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/posts/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'test title',
            desc: 'test description'
        })
        .expect(404);
});

it('returns a 401 if user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .post(`/api/posts/${id}`)
        .send({
            title: 'test title',
            desc: 'test description'
        })
        .expect(401);
});

it('returns a 401 if user does not own the post', async () => {

    const user1Cookie = global.signin();
    const user2Cookie = global.signin();

    const response = await request(app)
        .post('/api/posts')
        .set('Cookie', user1Cookie)
        .send({
            title: 'test title',
            desc: 'test description'
        });

    await request(app)
        .post(`/api/posts/${response.body.id}`)
        .set('Cookie', user2Cookie)
        .send({
            title: 'updated title',
            desc: 'updated description'
        })
        .expect(401);
});

it('returns a 400 if the user provides an invalid title or desc', async () => {

    const cookie = global.signin();

    const response = await request(app)
        .post('/api/posts')
        .set('Cookie', cookie)
        .send({
            title: 'test title',
            desc: 'test desc'
        });

    await request(app)
        .post(`/api/posts/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            desc: 'test desc'
        })
        .expect(400);
});


it('updates the post provided valid inputs', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post('/api/posts')
        .set('Cookie', cookie)
        .send({
            title: 'test title',
            desc: 'test description'
        });

    const updateResponse = await request(app)
        .post(`/api/posts/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'updated title',
            desc: 'updated description'
        })
        .expect(200);

    expect(updateResponse.body.title).toEqual('updated title');
    expect(updateResponse.body.desc).toEqual('updated description');
});

it('publishe an event ', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post('/api/posts')
        .set('Cookie', cookie)
        .send({
            title: 'test title',
            desc: 'test description'
        });

    await request(app)
        .post(`/api/posts/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'updated title',
            desc: 'updated description'
        })
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
