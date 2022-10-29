import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface PostAttrs {
    id: string,
    title: string;
    desc: string;
}

interface PostModel extends mongoose.Model<PostDoc> {
    build(attr: PostAttrs): PostDoc;
}

interface PostDoc extends mongoose.Document {
    title: string;
    desc: string;
    version: number;
}

const postSchema = new mongoose.Schema({
    title: {
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

postSchema.set('versionKey', 'version');
postSchema.plugin(updateIfCurrentPlugin);

postSchema.statics.build = (attrs: PostAttrs) => {
    return new Post({
        _id: attrs.id,
        title: attrs.title,
        desc: attrs.desc
    });
}

const Post = mongoose.model<PostDoc, PostModel>('Post', postSchema);

export { Post };