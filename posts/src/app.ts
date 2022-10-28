import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { currentUser, errorHandler, NotFoundError } from '@learnatibm/sharedlib';
import { createPostRouter } from './routes/new';
import { updatePostRouter } from './routes/update';
import { getPostsRouter } from './routes/posts';
import { getMyPostsRouter } from './routes/myposts';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test'
    })
)
app.use(currentUser);
app.use(createPostRouter);
app.use(updatePostRouter);
app.use(getPostsRouter);
app.use(getMyPostsRouter);

app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };