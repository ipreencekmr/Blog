import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface CommentAttrs {
    userId: string;
    postId: string;
    desc: string;
    date: Date;
}

interface CommentModel extends mongoose.Model<CommentDoc> {
    build(attr: CommentAttrs): CommentDoc;
}

interface CommentDoc extends mongoose.Document {
    userId: string;
    postId: string;
    desc: string;
    date: Date;
    version: number;
}

const commentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    postId: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    date: {
        type: mongoose.Schema.Types.Date,
        default: Date.now
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
    return new Comment(attrs);
}

const Comment = mongoose.model<CommentDoc, CommentModel>('Comment', commentSchema);

export { Comment };