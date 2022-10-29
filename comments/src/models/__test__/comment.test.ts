import { Comment } from '../comment';
import mongoose from 'mongoose';

it('implements optimistic concurrency control', async () => {
    const comment = Comment.build({
        userId: new mongoose.Types.ObjectId().toHexString(),
        postId: new mongoose.Types.ObjectId().toHexString(),
        desc: 'test desc',
        date: new Date()
    });

    await comment.save();

    // fetch the comment twice  
    const firstInstance = await Comment.findById(comment.id);
    const secondInstance = await Comment.findById(comment.id);

    // make two separate changes to the post we fetched
    firstInstance!.set({ desc: 'update desc one' });
    secondInstance!.set({ desc: 'update desc two' });

    // save the first instance
    await firstInstance!.save();

    try {
        // save the second instance
        await secondInstance!.save();
    } catch (err) {
        return;
    }

    throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {

    const comment = Comment.build({
        userId: new mongoose.Types.ObjectId().toHexString(),
        postId: new mongoose.Types.ObjectId().toHexString(),
        desc: 'test desc',
        date: new Date()
    });

    await comment.save();
    expect(comment.version).toEqual(0);

    await comment.save();
    expect(comment.version).toEqual(1);

    await comment.save();
    expect(comment.version).toEqual(2);
});