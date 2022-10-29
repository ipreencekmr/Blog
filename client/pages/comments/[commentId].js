import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

const EditComment = ({ comment }) => {

    const [desc, setDesc] = useState(comment.desc);

    const { doRequest, errors } = useRequest({
        url: `/api/comments/${comment.id}`,
        method: 'post',
        body: {
            postId: comment.postId,
            desc
        },
        onSuccess: () => {
            Router.push('/');
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
                {errors}
                <Button className="mt-2" variant="primary" type="submit">
                    Update
                 </Button>
            </Form>
        </Card.Body>
    </Card>
};

EditComment.getInitialProps = async (context, client) => {
    const { commentId } = context.query;
    const { data } = await client.get(`/api/comments/${commentId}`);
    return { comment: data };
}

export default EditComment;