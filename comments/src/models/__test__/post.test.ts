import { Post } from '../post';
import mongoose from 'mongoose';

it('implements optimistic concurrency control', async () => {
    const post = Post.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'test title',
        desc: 'test desc'
    });

    await post.save();

    // fetch the post twice  
    const firstInstance = await Post.findById(post.id);
    const secondInstance = await Post.findById(post.id);

    // make two separate changes to the post we fetched
    firstInstance!.set({ title: 'update desc one' });
    secondInstance!.set({ title: 'update desc two' });

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

    const post = Post.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'test title',
        desc: 'test desc',
    });

    await post.save();
    expect(post.version).toEqual(0);

    await post.save();
    expect(post.version).toEqual(1);

    await post.save();
    expect(post.version).toEqual(2);
});