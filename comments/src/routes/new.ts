import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, requireAuth, NotFoundError } from '@learnatibm/sharedlib';
import { Comment } from '../models/comment';
import { natsWrapper } from '../nats-wrapper';
import mongoose from 'mongoose';
import { CommentCreatedPublisher } from '../events/publishers/comment-created-publisher';
import { Post } from '../models/post';

const router = express.Router();

router.post('/api/comments',
    requireAuth,
    [
        body('postId')
            .trim()
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('Title must be provided'),
        body('desc')
            .trim()
            .notEmpty()
            .withMessage('You must supply a description')
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        const { postId, desc } = req.body;

        const post = await Post.findById(postId);

        if (!post) {
            throw new NotFoundError();
        }

        const comment = Comment.build({
            userId: req.currentUser!.id,
            postId: post.id,
            desc,
            date: new Date()
        });

        await comment.save();

        new CommentCreatedPublisher(natsWrapper.client).publish({
            id: comment.id,
            version: comment.version,
            userId: comment.userId,
            desc: comment.desc,
            postId: comment.postId
        });

        res.status(201).send(comment);
    }
);

export { router as createCommentRouter };