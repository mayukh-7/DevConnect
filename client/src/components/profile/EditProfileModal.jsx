// src/components/profile/EditProfileModal.jsx

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Loader2 } from 'lucide-react';

// We pass the logged-in user's data to pre-fill the form
const EditProfileModal = ({ profileUser }) => {
    const [formData, setFormData] = useState({
        username: "",
        bio: "",
       
    });

    const { updateProfile, isUpdatingProfile } = useAuthStore();

    // When the component loads, pre-fill the form with existing user data
    useEffect(() => {
        if (profileUser) {
            setFormData({
                username: profileUser.username,
                bio: profileUser.bio || "", // Use empty string if bio is null
            });
        }
    }, [profileUser]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // This will update the user and close the modal on success
        await updateProfile(formData);
        
        // This closes the modal
        document.getElementById('edit_profile_modal').close();
    };

    return (
        <dialog id="edit_profile_modal" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">Edit Profile</h3>
                
                <form onSubmit={handleSubmit}>
                    {/* Username */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Username</span>
                        </label>
                        <input
                            type="text"
                            name="username"
                            className="input input-bordered ml-2"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Bio */}
                    <div className="form-control mt-2">
                        <label className="label">
                            <span className="label-text">Bio</span>
                        </label>
                        <textarea
                            className="textarea textarea-bordered ml-4"
                            name="bio"
                            placeholder="Tell us about yourself..."
                            value={formData.bio}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    {/* Action Buttons */}
                    <div className="modal-action">
                        {/* "Close" button */}
                        <button 
                            type="button" 
                            className="btn" 
                            onClick={() => document.getElementById('edit_profile_modal').close()}
                        >
                            Close
                        </button>
                        
                        {/* "Save" button */}
                        <button 
                            type="submit" 
                            className="btn btn-primary ml-3 bg-blue-400"
                            disabled={isUpdatingProfile}
                        >
                            {isUpdatingProfile ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>
            {/* Click outside to close */}
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    );
};

export default EditProfileModal;