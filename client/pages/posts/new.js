import React, { useState } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

const NewPost = () => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const { doRequest, errors } = useRequest({
        url: '/api/posts',
        method: 'post',
        body: {
            title, desc
        },
        onSuccess: () => {
            Router.push('/')
        }
    });

    const onSubmit = (event) => {
        event.preventDefault();
        doRequest();
    }

    return <React.Fragment>
        <h1>Create a Post</h1>
        <Card className="text-center mt-2">
            <Card.Body>
                <Form onSubmit={onSubmit}>
                    <InputGroup className="mb-3">
                        <InputGroup.Text id="inputGroup-sizing-default">
                            Post Title
                         </InputGroup.Text>
                        <Form.Control
                            aria-label="Default"
                            aria-describedby="inputGroup-sizing-default"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </InputGroup>
                    <FloatingLabel controlId="floatingTextarea2" label="Description">
                        <Form.Control
                            as="textarea"
                            placeholder="Leave a comment here"
                            style={{ height: '100px' }}
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                        />
                    </FloatingLabel>
                    {errors}
                    <Button className="mt-2" variant="primary" type="submit">
                        Comment
        </Button>
                </Form>
            </Card.Body>
        </Card>
    </React.Fragment>;
}

export default NewPost;