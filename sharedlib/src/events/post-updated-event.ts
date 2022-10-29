import { Subjects } from './subjects';

export interface PostUpdatedEvent {
    subject: Subjects.PostUpdated
    data: {
        id: string,
        version: number,
        title: string,
        desc: string,
        userId: string,
        date: Date
    };
}

