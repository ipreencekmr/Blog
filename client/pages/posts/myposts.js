import PostList from '../../components/post-list';

const MyPost = ({ currentUser, posts }) => {
    return (
        <div>
            <h1>My Posts</h1>
            <PostList currentUser={currentUser} posts={posts} />
        </div>
    )
}

MyPost.getInitialProps = async (context, client, currentUser) => {

    const { data } = await client.get('/api/posts/myposts');

    return { posts: data };
}

export default MyPost;