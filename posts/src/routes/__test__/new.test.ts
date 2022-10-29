import request from 'supertest';
import { app } from '../../app';
import { Post } from '../../models/post';
import { natsWrapper } from '../../nats-wrapper';

it('can only be accessed if user is signed in',
    async () => {
        const response = await request(app)
            .post('/api/posts')
            .send({});
        expect(response.status).not.toEqual(404);
    });

it('returns an error if invalid title is provided',
    async () => {
        const response = await request(app)
            .post('/api/posts')
            .send({});

        expect(response.status).toEqual(401);
    });

it('returns a status other than 401 if user is signed in',
    async () => {
        const response = await request(app)
            .post('/api/posts')
            .set('Cookie', global.signin())
            .send({});

        expect(response.status).not.toEqual(401);
    });


it('returns an error if an invalid title is provided',
    async () => {

        await request(app)
            .post('/api/posts')
            .set('Cookie', global.signin())
            .send({
                title: '',
                desc: 'description'
            })
            .expect(400);

        await request(app)
            .post('/api/posts')
            .set('Cookie', global.signin())
            .send({
                desc: 'description'
            })
            .expect(400);
    });

it('returns an error if an invalid description is provided',
    async () => {

        await request(app)
            .post('/api/posts')
            .set('Cookie', global.signin())
            .send({
                title: 'adkgd',
                desc: ''
            })
            .expect(400);

        await request(app)
            .post('/api/posts')
            .set('Cookie', global.signin())
            .send({
                title: 'adkgd',
            })
            .expect(400);
    });

it('creates a post with valid inputs',
    async () => {
        let posts = await Post.find({});
        expect(posts.length).toEqual(0);

        await request(app)
            .post('/api/posts')
            .set('Cookie', global.signin())
            .send({
                title: 'test title',
                desc: 'test description'
            })
            .expect(201)

        posts = await Post.find({});
        expect(posts.length).toEqual(1);
        expect(posts[0].desc).toEqual('test description');
    });

it('publishes an event', async () => {
    await request(app)
        .post('/api/posts')
        .set('Cookie', global.signin())
        .send({
            title: 'test title',
            desc: 'test description'
        })
        .expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
