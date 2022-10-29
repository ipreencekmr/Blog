
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Router from 'next/router';

export default ({ comments }) => {

    const onClick = (commentId) => {
        Router.push('/comments/[commentId]', `/comments/${commentId}`);
    }

    const commentList = comments && comments.map(comment => {
        return <ListGroup.Item key={comment.id}>
            <Row>
                <Col lg={10} md={8}>
                    {comment.desc}
                </Col>
                <Col lg={2} md={4}>
                    <Button variant="link" onClick={() => onClick(comment.id)}>Edit</Button>
                </Col>
            </Row>
        </ListGroup.Item>
    });

    return <ListGroup>
        {commentList}
    </ListGroup>
};