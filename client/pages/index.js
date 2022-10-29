import PostList from '../components/post-list';

const LandingPage = ({ currentUser, posts }) => {
    return (
        <div>
            <h1>Posts</h1>
            <PostList currentUser={currentUser} posts={posts} />
        </div>
    )
}

LandingPage.getInitialProps = async (context, client, currentUser) => {

    const { data } = await client.get('/api/posts');

    return { posts: data };
}

export default LandingPage;