import { Subjects } from './subjects';

export interface CommentUpdatedEvent {
    subject: Subjects.CommentUpdated;
    data: {
        id: string,
        version: number,
        userId: string,
        desc: string,
        postId: string
    }
}