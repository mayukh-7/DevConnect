import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createPost,
  getAllPosts,
  deletePost,
  getUserPosts,
  toggleLikePost,
  addComment
} from "../controllers/post.controller.js";

const router = express.Router();

// Create a new post
router.route("/create").post(verifyJWT, upload.single("image"), createPost);

// Get all posts
router.route("/").get(verifyJWT, getAllPosts);

// Delete a post
router.route("/:postId").delete(verifyJWT, deletePost);

//getuserpost
router.route("/user/:userId").get(verifyJWT, getUserPosts);

// Toggle like on a post (Like/Unlike)
router.route("/like/:postId").patch(verifyJWT,toggleLikePost); 

// Add a comment to a post
router.route("/comment/:postId").post(verifyJWT,addComment);

export default router;
