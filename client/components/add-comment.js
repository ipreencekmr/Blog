import React, { useState } from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import useRequest from '../hooks/use-request';

export default ({ postId }) => {
    const [desc, setDesc] = useState('');
    const { doRequest, errors } = useRequest({
        url: '/api/comments',
        method: 'post',
        body: {
            postId, desc
        },
        onSuccess: () => {
            // Refresh the page
        }
    });

    const onSubmit = (event) => {
        event.preventDefault();
        doRequest();
    }

    return <Card className="text-center mt-2">
        <Card.Body>
            <Form onSubmit={onSubmit}>
                <FloatingLabel controlId="floatingTextarea2" label="Comments">
                    <Form.Control
                        as="textarea"
                        placeholder="Leave a comment here"
                        style={{ height: '100px' }}
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                    />
                </FloatingLabel>
                <Button className="mt-2" variant="primary" type="submit">
                    Comment
            </Button>
            </Form>
        </Card.Body>
    </Card>
};