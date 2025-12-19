import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["like", "comment", "follow"], required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" }, // Optional: only for likes/comments
    read: { type: Boolean, default: false }
}, { timestamps: true });

export const Notification = mongoose.model("Notification", notificationSchema);