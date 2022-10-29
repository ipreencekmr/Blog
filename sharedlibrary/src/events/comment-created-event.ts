import { Subjects } from './subjects';

export interface CommentCreatedEvent {
    subject: Subjects.CommentCreated;
    data: {
        id: string,
        version: number,
        userId: string,
        desc: string,
        postId: string
    }
}