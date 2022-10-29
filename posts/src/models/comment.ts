import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface CommentAttrs {
    id: string;
    postId: string;
    desc: string;
    version: number;
}

interface CommentModel extends mongoose.Model<CommentDoc> {
    build(attr: CommentAttrs): CommentDoc;
    findByEvent(event: { id: string, version: number }): Promise<CommentDoc | null>;
}

export interface CommentDoc extends mongoose.Document {
    postId: string;
    desc: string;
    version: number;
}

const commentSchema = new mongoose.Schema({
    postId: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

commentSchema.set('versionKey', 'version');
commentSchema.plugin(updateIfCurrentPlugin);

commentSchema.statics.build = (attrs: CommentAttrs) => {
    return new Comment({
        _id: attrs.id,
        postId: attrs.postId,
        desc: attrs.desc
    });
}

commentSchema.statics.findByEvent = (event: { id: string, version: number }) => {
    return Comment.findOne({
        _id: event.id,
        version: event.version - 1
    });
};

const Comment = mongoose.model<CommentDoc, CommentModel>('Comment', commentSchema);

export { Comment };