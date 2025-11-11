// src/components/profile/ProfileHeader.jsx

import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Edit } from 'lucide-react';
import EditProfileModal from './EditProfileModal.jsx';
// Receive profileUser as a prop
const ProfileHeader = ({ profileUser }) => {
    // --- Add your logic here ---
    const { authUser } = useAuthStore();
    const isOwner = authUser?._id === profileUser?._id;
    
    // Handle loading state
    if (!profileUser) {
        return <p>Loading profile...</p>; 
    }
    const openModal = () => {
        document.getElementById('edit_profile_modal').showModal();
    };
    // ----------------------------
    // const { authUser } = useAuthStore(); // Placeholder for your logic
    // const isOwner = authUser?._id === profileUser?._id; // Placeholder

    return (
        <>
        <div className="card bg-base-100 shadow-md p-6">
            <div className="flex flex-col md:flex-row items-center">
                {/* Profile Avatar */}
                <div className="avatar mb-4 md:mb-0 md:mr-6">
                    <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img 
                            src={profileUser?.ProfilePic || `https://ui-avatars.com/api/?name=${profileUser?.username}&background=random`} 
                            alt="profile" 
                        />
                    </div>
                </div>
                
                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-bold">{profileUser?.username}</h2>
                    <p className="text-base-content/70">@{profileUser?.username}</p>
                    
                    {/* Placeholder for Bio - you can add this to your backend later */}
                    <p className="mt-2">{profileUser.bio || "This is a placeholder bio. User can edit this later."}</p>

                    {/* Placeholder for Stats */}
                    <div className="flex gap-4 mt-4 justify-center md:justify-start">
                        <div>
                            <span className="font-bold">150</span> Following
                        </div>
                        <div>
                            <span className="font-bold">280</span> Followers
                        </div>
                    </div>
                </div>

                {/* Edit Profile Button */}
                {/* Only show this button if the authUser is the owner of this profile */}
                {isOwner && (
                    <button className="btn btn-outline btn-sm mt-4 md:mt-0"
                    onClick={openModal}
                    >
                        <Edit className="h-4 w-4" />
                        Edit Profile
                    </button>
                )}
            </div>
        </div>
        {isOwner && <EditProfileModal profileUser={profileUser}/>}
    </>
    );
};

export default ProfileHeader;