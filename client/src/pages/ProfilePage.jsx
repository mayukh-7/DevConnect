import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProfileStore } from '../store/useProfileStore';
import ProfileHeader from '../components/profile/ProfileHeader.jsx';
import Post from '../components/feed/Post.jsx'; // Your existing Post component

const ProfilePage = () => {
    // 1. Get the username from the URL
    const { username } = useParams();
    
    // 2. Get state and actions from your store
    const { profileUser, posts, fetchProfile, isLoading } = useProfileStore();

    // 3. Fetch data when the component mounts or username changes
    useEffect(() => {
        fetchProfile(username);
    }, [fetchProfile, username]);

    // 4. Handle loading state
    if (isLoading) {
        return (
            <div className="flex justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {/* 5. Render the header */}
            <ProfileHeader profileUser={profileUser} />

            {/* 6. Render the user's posts */}
            <h2 className="text-lg font-semibold">User Posts</h2>
            <div className="flex flex-col gap-4">
                {posts && posts.length > 0 ? (
                    posts.map((post) => (
                        <Post key={post._id} post={post} />
                    ))
                ) : (
                    <p className="text-center text-base-content/70">
                        {profileUser?.username} hasn't posted anything yet.
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;