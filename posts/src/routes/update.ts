import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, NotAuthorizedError, requireAuth, NotFoundError } from '@learnatibm/sharedlib';
import { Post } from '../models/post';
import { PostUpdatedPublisher } from '../events/publishers/post-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post('/api/posts/:id',
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

        const post = await Post.findById(req.params.id);

        if (!post) {
            throw new NotFoundError();
        }

        if (post.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        post.set({
            title,
            desc
        });

        await post.save();

        await new PostUpdatedPublisher(natsWrapper.client).publish({
            id: post.id,
            title: post.title,
            desc: post.desc,
            date: post.date,
            userId: post.userId,
            version: post.version
        });

        res.send(post);
    }
);

export { router as updatePostRouter };