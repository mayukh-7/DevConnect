import { Post } from "../models/post.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Notification } from "../models/notification.model.js";
 const createPost = asyncHandler(async (req, res) => {
  const { caption } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized: Please log in");
  }

  // 1. Change from .path to .buffer for Memory Storage
  const fileBuffer = req.file?.buffer; 

  let imageUrl = "";
  
  if (fileBuffer) {
    // 2. Pass the buffer to the updated stream-based Cloudinary function
    const uploadedImage = await uploadOnCloudinary(fileBuffer);
    imageUrl = uploadedImage?.url || "";
  }

  const post = await Post.create({
    caption,
    image: imageUrl,
    createdBy: userId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, post, "Post created successfully"));
});

 const getAllPosts = asyncHandler(async(req,res)=>{
    const posts = await Post.find()
    .populate("createdBy", "username ProfilePic")
    .populate({
        path: "comments.createdBy",
        model: "User", // Make sure this matches your User model name
        select: "username ProfilePic" // Select only the fields you need
    })
    .sort({createdAt: -1})


    return res
    .status(200)
    .json(new ApiResponse(200, posts, "Fetched all posts successfully"));

 });

 const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user?._id;

  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  if (post.createdBy.toString() !== userId.toString()) {
    throw new ApiError(403, "You can only delete your own posts");
  }

  await post.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Post deleted successfully"));
});

 const getUserPosts = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const posts = await Post.find({ createdBy: userId })
    .populate("createdBy", "username ProfilePic")
        .populate({ 
            path: "comments.createdBy",
            model: "User",
            select: "username ProfilePic"
        })
        .sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Fetched user's posts successfully"));
});


const toggleLikePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const userId = req.user?._id;

    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
        // If already liked, unlike (pull userId from array)
        post.likes.pull(userId);
    } else {
        // If not liked, like (push userId to array)
        post.likes.push(userId);
        if (post.createdBy.toString() !== userId.toString()) {
            await Notification.create({
                from: userId,
                to: post.createdBy,
                type: "like",
                post: postId,
            });
        }
    }

    await post.save();
    return res
        .status(200)
        .json(new ApiResponse(200, { isLiked: !isLiked }, `Post ${isLiked ? 'unliked' : 'liked'} successfully`));
});

const addComment = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user?._id;

    if (!text || text.trim() === "") {
        throw new ApiError(400, "Comment text cannot be empty");
    }

    const post = await Post.findByIdAndUpdate(
        postId,
        {
            $push: {
                comments: {
                    text,
                    createdBy: userId, // Link comment to the user ID
                },
            },
        },
        { new: true } // Return the updated document
    ).populate("createdBy", "username profilePic"); // Optional: Populate to return full user data

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    // Return the newly added comment (which is the last one in the array)
    const newComment = post.comments[post.comments.length - 1];
    if (post.createdBy.toString() !== userId.toString()) {
        await Notification.create({
            from: userId,
            to: post.createdBy,
            type: "comment",
            post: postId,
        });
    }

    return res
        .status(201)
        .json(new ApiResponse(201, newComment, "Comment added successfully"));
});
export {
    createPost, 
    getAllPosts, 
    deletePost,
    getUserPosts,
    toggleLikePost,
    addComment,
}