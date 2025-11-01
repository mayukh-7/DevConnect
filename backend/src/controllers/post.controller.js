import { Post } from "../models/post.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

 const createPost = asyncHandler(async(req,res)=>{
    const {caption} = req.body;
    const userId = req.user?._id;
    if (!userId) {
    throw new ApiError(401, "Unauthorized: Please log in");
  }
  const imageUrl = req.file?.path;
//   if(!imageUrl){
//     throw new ApiError(402, "Not a valid image");
//   }

  const uploadedImage = await uploadOnCloudinary(imageUrl);
  const post = await Post.create({
    caption,
    image: uploadedImage?.url || "",
    createdBy: userId,
  });
  return res
  .status(201)
  .json(new ApiResponse(201, post, "Post created successfully"));
 });

 const getAllPosts = asyncHandler(async(req,res)=>{
    const posts = await Post.find()
    .populate("createdBy", "username ProfilePic")
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