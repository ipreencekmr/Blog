import express, { Request, Response } from 'express';
import { validateRequest, requireAuth } from '@learnatibm/sharedlib';
import { Post } from '../models/post';

const router = express.Router();

router.get('/api/posts/myposts',
    requireAuth,
    validateRequest,
    async (req: Request, res: Response) => {

        const userId = req.currentUser!.id;

        const posts = await Post.find({ userId: userId }).populate('comments');

        res.send(posts);
    }
);

export { router as getMyPostsRouter };