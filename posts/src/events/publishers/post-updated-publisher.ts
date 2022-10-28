import { Publisher, Subjects, PostUpdatedEvent } from '@learnatibm/sharedlib';

export class PostUpdatedPublisher extends Publisher<PostUpdatedEvent>{
    subject: Subjects.PostUpdated = Subjects.PostUpdated;
}