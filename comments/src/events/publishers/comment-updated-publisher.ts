import { Publisher, CommentUpdatedEvent, Subjects } from '@learnatibm/sharedlib';

export class CommentUpdatedPublisher extends Publisher<CommentUpdatedEvent>{
    subject: Subjects.CommentUpdated = Subjects.CommentUpdated;
}