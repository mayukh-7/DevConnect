// src/components/profile/ProfileHeader.jsx

import React, {useRef} from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Edit, Camera, Loader2 } from 'lucide-react';
import EditProfileModal from './EditProfileModal.jsx';
import { useProfileStore } from '../../store/useProfileStore.js'
// Receive profileUser as a prop
const ProfileHeader = ({ profileUser }) => {
    // --- Add your logic here ---
    const fileInputRef = useRef(null); 
    const { authUser, updateProfilePic, isUpdatingProfile } = useAuthStore();
    const isOwner = authUser?._id === profileUser?._id;

    // Handle loading state
    if (!profileUser) {
        return <p>Loading profile...</p>;
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        await updateProfilePic(file);
    };

    const openModal = () => {
        document.getElementById('edit_profile_modal').showModal();
    };
    // ----------------------------
    // const { authUser } = useAuthStore(); // Placeholder for your logic
    // const isOwner = authUser?._id === profileUser?._id; // Placeholder
    const { toggleFollow } = useProfileStore();
    const isFollowing = profileUser.followers.includes(authUser?._id);

    return (
        <>
            <div className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300 border border-base-content/5 p-6 rounded-2xl">
                <div className="flex flex-col md:flex-row items-center">
                    {/* Profile Avatar */}
                    <div className="relative group mb-4 md:mb-0 md:mr-6">
                        <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden bg-base-300">
                            <img 
                                src={profileUser?.ProfilePic || `https://ui-avatars.com/api/?name=${profileUser?.username}&background=random`} 
                                alt="profile"
                                className={`w-full h-full object-cover ${isUpdatingProfile ? "opacity-50" : ""}`}
                            />
                            
                            {/* Loading Spinner during upload */}
                            {isUpdatingProfile && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                </div>
                            )}
                        </div>

                        {/* Camera Icon Overlay (Only for Owner) */}
                        {isOwner && !isUpdatingProfile && (
                            <label 
                                htmlFor="avatar-upload"
                                className="absolute bottom-0 right-0 bg-primary p-2 rounded-full cursor-pointer shadow-lg hover:scale-110 transition-all border-2 border-base-100"
                            >
                                <Camera className="w-4 h-4 text-white" />
                                <input 
                                    type="file" 
                                    id="avatar-upload"
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={isUpdatingProfile}
                                />
                            </label>
                        )}
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-bold">{profileUser?.username}</h2>
                        <p className="text-base-content/70">@{profileUser?.username}</p>

                        {/* Placeholder for Bio - you can add this to your backend later */}
                        <p className="mt-2">{profileUser.bio || "This is a placeholder bio. User can edit this later."}</p>

                        {/* Placeholder for Stats */}
                        <div className="flex gap-4 mt-4 justify-center md:justify-start">
                            <div><span className="font-bold">{profileUser.following?.length || 0}</span> Following</div>
                            <div><span className="font-bold">{profileUser.followers?.length || 0}</span> Followers</div>
                        </div>
                    </div>
                    
                    {/* Edit Profile Button */}
                    {/* Only show this button if the authUser is the owner of this profile */}
                    {isOwner ? (
                        <button onClick={openModal} className="btn btn-outline btn-sm mt-4 md:mt-0">
                            <Edit className="h-4 w-4" /> Edit Profile
                        </button>
                    ) : (
                        <button
                            onClick={toggleFollow}
                            className={`btn btn-sm mt-4 ml-4 md:mt-0 ${isFollowing ? 'btn-outline btn-error' : 'btn-primary'} bg-blue-400`}
                        >
                            {isFollowing ? "Unfollow" : "Follow"}
                        </button>
                    )}
                </div>
            </div>
            {isOwner && <EditProfileModal profileUser={profileUser} />}
        </>
    );
};

export default ProfileHeader;