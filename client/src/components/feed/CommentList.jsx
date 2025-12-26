// src/components/feed/CommentList.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const CommentList = ({ post }) => {
    // Reverse the comments to show newest first
    const commentsToShow = post.comments ? [...post.comments].reverse() : [];

    return (
        <div className="space-y-3 mt-4">
            {commentsToShow.length === 0 ? (
                <p className="text-sm text-base-content/70">No comments yet.</p>
            ) : (
                commentsToShow.map((comment) => (
                    <div key={comment._id} className="flex gap-3">
                        {/* Avatar */}
                        <div className="avatar">
                            <div className="w-8 h-8 rounded-full">
                                <img 
                                    src={comment.createdBy.ProfilePic || `https://ui-avatars.com/api/?name=${comment.createdBy.username}&background=random`} 
                                    alt="User profile"
                                />
                            </div>
                        </div>
                        {/* Comment Text */}
                        <div className="bg-base-200/50 rounded-xl px-3 py-2 flex-1">
                            <Link to={`/profile/${comment.createdBy.username}`} className="font-semibold text-sm hover:underline">
                                {comment.createdBy.username}
                            </Link>
                            <p className="text-sm">{comment.text}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default CommentList;