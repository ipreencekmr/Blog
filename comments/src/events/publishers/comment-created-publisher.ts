import { Publisher, CommentCreatedEvent, Subjects } from '@learnatibm/sharedlib';

export class CommentCreatedPublisher extends Publisher<CommentCreatedEvent>{
    subject: Subjects.CommentCreated = Subjects.CommentCreated;
}