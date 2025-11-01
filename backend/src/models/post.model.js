import mongoose,{Schema} from "mongoose";

const postSchema = new Schema({
    caption: {
        type: String,
    },
    image: {
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    comments: [
        {
            text: String,
            createdBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        },
    ],
}, {timestamps: true})

export const Post = mongoose.model("Post", postSchema);