import Card from 'react-bootstrap/Card';
import Comments from '../components/comments';
import AddComment from '../components/add-comment';
import React from 'react';

export default ({ currentUser, posts }) => {

    const postElements = posts && posts.map(post =>
        <Card className="text-center" key={post.id}>
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
                <AddComment postId={post.postId}></AddComment>
            </Card.Footer>
        </Card>
    );

    return <React.Fragment>
        <Card className="text-center" >
            <Card.Header>My Post
        </Card.Header>
            <Card.Body>
                <Card.Text>
                    Post Description
            </Card.Text>
            </Card.Body>
            <Card.Footer className="text-muted">
                <Comments comments={[]} />
                <AddComment postId={"af"}></AddComment>
            </Card.Footer>
        </Card>
    </React.Fragment>
};