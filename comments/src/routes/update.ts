import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, requireAuth, NotFoundError, NotAuthorizedError } from '@learnatibm/sharedlib';
import { Comment } from '../models/comment';
import { natsWrapper } from '../nats-wrapper';
import mongoose from 'mongoose';
import { CommentUpdatedPublisher } from '../events/publishers/comment-updated-publisher';

const router = express.Router();

router.post('/api/comments/:id',
    requireAuth,
    [
        body('postId')
            .trim()
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('PostId must be provided'),
        body('desc')
            .trim()
            .notEmpty()
            .withMessage('You must supply a description')
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            throw new NotFoundError();
        }

        if (comment.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        const { title, desc } = req.body;

        comment.set({
            title,
            desc
        });

        await comment.save();

        new CommentUpdatedPublisher(natsWrapper.client).publish({
            id: comment.id,
            version: comment.version,
            userId: comment.userId,
            desc: comment.desc,
            postId: comment.postId
        });

        res.send(comment);
    }
);

export { router as updateCommentRouter };