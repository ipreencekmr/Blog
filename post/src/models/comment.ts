import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface CommentAttrs {
    desc: string;
}

interface CommentModel extends mongoose.Model<CommentDoc> {
    build(attr: CommentAttrs): CommentDoc;
}

interface CommentDoc extends mongoose.Document {
    desc: string;
}

const commentSchema = new mongoose.Schema({
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
    return new Comment(attrs);
}

const Comment = mongoose.model<CommentDoc, CommentModel>('Comment', commentSchema);

export { Comment };