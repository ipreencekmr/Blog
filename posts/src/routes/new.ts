import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, requireAuth } from '@learnatibm/sharedlib';
import { Post } from '../models/post';
import { PostCreatedPublisher } from '../events/publishers/post-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post('/api/posts',
    requireAuth,
    [
        body('title')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Title must be provided'),
        body('desc')
            .trim()
            .notEmpty()
            .withMessage('You must supply a description')
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        const { title, desc } = req.body;

        const post = Post.build({
            userId: req.currentUser!.id,
            title,
            desc,
            date: new Date()
        });

        await post.save();

        await new PostCreatedPublisher(natsWrapper.client).publish({
            id: post.id,
            title: post.title,
            desc: post.desc,
            date: post.date,
            userId: post.userId,
            version: post.version
        });

        res.status(201).send(post);
    }
);

export { router as createPostRouter };