import { Publisher, PostCreatedEvent, Subjects } from '@learnatibm/sharedlib';

export class PostCreatedPublisher extends Publisher<PostCreatedEvent>{
    subject: Subjects.PostCreated = Subjects.PostCreated;
}