

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Send, MoreHorizontal } from 'lucide-react';
import { usePostStore } from '../../store/usePostStore.js';
import { useAuthStore } from '../../store/useAuthStore.js'
import CommentForm from './CommentForm.jsx';
import CommentList from './CommentList.jsx';
// We receive the 'post' object as a prop from FeedPage.jsx
const Post = ({ post }) => {

    // Placeholder for username - you might need to adjust based on your post object structure
    // Your backend 'getAllPosts' populates 'createdBy'
    const user = post.createdBy;
    const postDate = new Date(post.createdAt).toLocaleDateString();
    const { toggleLike, deletePost, isLoadingDelete } = usePostStore();
    const { authUser } = useAuthStore();
    const [showComments, setShowComments] = useState(false);
    const isLiked = authUser ? post.likes.includes(authUser._id) : false;
    const isOwner = authUser._id === post.createdBy._id;


    const handleLike = async () => {
        await toggleLike(post._id);
    }
    const handleDelete = async () => {
        await deletePost(post._id);

    }

    return (
        <div className="card bg-base-100 shadow-md mb-4">
            <div className="card-body p-4">

                {/* Post Header */}
                <div className="flex items-center gap-3">
                    <Link to={`/profile/${user.username}`} className="avatar">
                        <div className="w-10 rounded-full">
                            <img src={user.ProfilePic || `https://ui-avatars.com/api/?name=${user.username}&background=random`} alt="user profile" />
                        </div>
                    </Link>
                    <div className="flex-1">
                        <Link to={`/profile/${user.username}`} className="font-bold hover:underline">
                            {user.username}
                        </Link>
                        <p className="text-xs text-base-content/70">{postDate}</p>
                    </div>
                    {isOwner && (
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-sm btn-circle">
                                <MoreHorizontal className="h-5 w-5" />
                            </label>
                            <ul
                                tabIndex={0}
                                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32"
                            >
                                <li>
                                    <button
                                        className="text-red-500"
                                    onClick={handleDelete}
                                    disabled={isLoadingDelete} 
                                    >
                                        {isLoadingDelete ? "Deleting..." : "Delete"}
                                        
                                    </button>
                                </li>
                                {/* You can add an "Edit" button here later */}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Post Content */}
                <div className="mt-4">
                    {/* Post Caption (Text) */}
                    {post.caption && (
                        <p className="text-base-content">{post.caption}</p>
                    )}

                    {/* Post Image (if it exists) */}
                    {post.image && (
                        <img
                            src={post.image}
                            alt="post content"
                            className="mt-2 rounded-lg w-full object-cover"
                        />
                    )}
                </div>

                {/* Post Actions (Like, Comment) */}
                <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-4">
                        <button
                            className={`btn btn-ghost btn-sm flex items-center gap-1 ${isLiked ? "text-red-500" : ""}`}
                            onClick={handleLike}
                        >
                            {isLiked ? (
                                <Heart fill="currentColor" className="h-5 w-5" /> // Filled heart
                            ) : (
                                <Heart className="h-5 w-5" /> // Outline heart
                            )}

                            {/* Show the number of likes */}
                            {post.likes.length}
                        </button>
                        <button className="btn btn-ghost btn-sm flex items-center gap-1">
                            <MessageCircle className="h-5 w-5"
                                onClick={() => setShowComments(!showComments)}
                            />
                            {post.comments.length}
                        </button>
                    </div>
                    <button className="btn btn-ghost btn-sm flex items-center gap-1">
                        <Send className="h-5 w-5" />
                    </button>
                </div>
                {showComments && (
                    <div className="mt-4 border-t border-base-300 pt-4">
                        {/* Form to add a new comment */}
                        <CommentForm postId={post._id} />

                        {/* List of existing comments */}
                        <CommentList post={post} />
                    </div>
                )}

            </div>
        </div>
    );
};

export default Post;