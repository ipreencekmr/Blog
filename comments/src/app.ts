import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { currentUser, errorHandler, NotFoundError } from '@learnatibm/sharedlib';
import { createCommentRouter } from './routes/new';
import { updateCommentRouter } from './routes/update';
import { getCommentRouter } from './routes/detail';

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
app.use(createCommentRouter);
app.use(updateCommentRouter);
app.use(getCommentRouter);

app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };