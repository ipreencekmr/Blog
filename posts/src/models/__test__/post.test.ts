import { Post } from '../post';

it('implements optimistic concurrency control', async () => {
    const post = Post.build({
        title: 'test title',
        desc: 'test desc',
        userId: '123',
        date: new Date()
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
        title: 'test title',
        desc: 'test desc',
        userId: '123',
        date: new Date()
    });

    await post.save();
    expect(post.version).toEqual(0);

    await post.save();
    expect(post.version).toEqual(1);

    await post.save();
    expect(post.version).toEqual(2);
});