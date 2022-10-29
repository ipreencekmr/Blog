
import { Card } from 'react-bootstrap';

export default ({ currentUser }) => {
    return <Card className="text-center">
        <Card.Header>User Info</Card.Header>
        <Card.Body>
            <Card.Title>Email Address</Card.Title>
            <Card.Text>
                {currentUser.email}
            </Card.Text>
        </Card.Body>
    </Card>
};