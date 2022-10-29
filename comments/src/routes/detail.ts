import express, { Request, Response } from 'express';
import { param } from 'express-validator';
import { NotFoundError, requireAuth, validateRequest } from '@learnatibm/sharedlib';
import { Comment } from '../models/comment';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/api/comments/:commentId',
    requireAuth,
    [
        param('commentId')
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('Valid commentid should be provided')
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        const { commentId } = req.params;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            throw new NotFoundError();
        }

        res.status(200).send(comment);
    }
);

export { router as getCommentRouter };