import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { CommentDoc } from './comment';

interface PostAttrs {
    userId: string;
    title: string;
    desc: string;
    date: Date;
    comments?: Array<CommentDoc>;
}

interface PostModel extends mongoose.Model<PostDoc> {
    build(attr: PostAttrs): PostDoc;
}

interface PostDoc extends mongoose.Document {
    userId: string;
    title: string;
    desc: string;
    date: Date;
    version: number;
    comments: Array<CommentDoc>;
}

const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
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
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

postSchema.set('versionKey', 'version');
postSchema.plugin(updateIfCurrentPlugin);

postSchema.statics.build = (attrs: PostAttrs) => {
    return new Post(attrs);
}

const Post = mongoose.model<PostDoc, PostModel>('Post', postSchema);

export { Post };