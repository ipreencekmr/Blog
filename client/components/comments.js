
import ListGroup from 'react-bootstrap/ListGroup';

export default ({ comments }) => {

    const commentList = comments && comments.map(comment => {
        return <ListGroup.Item key={comment.id}>{comment.desc}</ListGroup.Item>
    });

    return <ListGroup>
        {commentList}
    </ListGroup>
};