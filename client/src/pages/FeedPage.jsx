import React, { useEffect } from 'react';
import CreatePost from '../components/feed/CreatePost.jsx';
import { usePostStore } from '../store/usePostStore.js';
import Post from '../components/feed/Post.jsx';
import { useAuthStore } from '../store/useAuthStore.js';
const FeedPage = () => {
  const { posts, fetchPosts } = usePostStore();
  const {checkAuth} = useAuthStore();
  useEffect(() => {
    checkAuth()
    fetchPosts()
  }, [])
  return (
  
    <div>
      {/* 1. Create Post Component */}
      <CreatePost />

      {/* 2. Post List (Placeholder) */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Feed</h2>
        <div className="flex flex-col gap-4">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <Post key={post._id} post={post} />
            ))
          ) : (
            <p className="text-center text-gray-500">No posts available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedPage;