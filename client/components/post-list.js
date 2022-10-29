import Card from 'react-bootstrap/Card';
import Comments from '../components/comments';
import AddComment from '../components/add-comment';
import React from 'react';

export default ({ currentUser, posts }) => {

    const postElements = posts && posts.map(post =>
        <Card className="m-4 text-center" key={post.id}>
            <Card.Header>
                {post.title}
            </Card.Header>
            <Card.Body>
                <Card.Text>
                    {post.desc}
                </Card.Text>
            </Card.Body>
            <Card.Footer className="text-muted">
                <Comments comments={post.comments} />
                <AddComment
                    currentUser={currentUser}
                    postId={post.id}>
                </AddComment>
            </Card.Footer>
        </Card>
    );

    return <React.Fragment>
        {postElements}
    </React.Fragment>
};