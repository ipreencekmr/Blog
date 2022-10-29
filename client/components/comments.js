
import ListGroup from 'react-bootstrap/ListGroup';

export default ({ comments }) => {

    const commentList = comments && comments.map(comment => {
        return <ListGroup.Item key={comment.id}>{comment.desc}</ListGroup.Item>
    });

    return <ListGroup>
        <ListGroup.Item>Cras justo odio</ListGroup.Item>
        <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
        <ListGroup.Item>Morbi leo risus</ListGroup.Item>
        <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
        <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
    </ListGroup>
};