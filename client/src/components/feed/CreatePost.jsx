import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore.js';
import { Image, Send, Loader2 } from 'lucide-react'; // Import Loader2
import { usePostStore } from '../../store/usePostStore.js';

const CreatePost = () => {
    const { authUser } = useAuthStore();
    const [caption, setCaption] = useState("");
    const [imageFile, setImageFile] = useState(null);

    // Get loading state to disable button
    const { createPost, isLoading } = usePostStore();

    const handlefilechange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 👇 FIX #1: You MUST use the FormData API for file uploads
        const formData = new FormData();
        
        formData.append("caption", caption);
        if (imageFile) {
            formData.append("image", imageFile);
        }

        // We call await here so we can clear the form only on success
        try {
            await createPost(formData);
            
            // Clear the form on successful post
            setCaption("");
            setImageFile(null);
            
            // Reset the file input visually (optional but good UX)
            document.getElementById('file-input').value = null; 
        } catch (error) {
            console.error("Failed to upload the post", error);
            // Toast is already handled in the store, so just log it here.
        }
    };

    return (
        <div className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300 border border-base-content/5 p-4 rounded-2xl mb-4">
            <div className="flex gap-4">
                <div className="avatar">
                    <div className="w-12 h-12 rounded-full">
                        <img src={authUser?.ProfilePic || `https://ui-avatars.com/api/?name=${authUser?.username}&background=random`} alt="profile" />
                    </div>
                </div>

                <textarea
                    className="textarea textarea-bordered w-full text-base-content" // Added text-base-content
                    placeholder={`What's on your mind, ${authUser?.username}?`}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    rows="3"
                ></textarea>
            </div>

            {/* Display a preview of the selected image name (optional) */}
            {imageFile && (
                <div className="text-sm text-gray-500 mt-2 ml-16">
                    Selected file: {imageFile.name}
                </div>
            )}

            <div className="flex justify-between items-center mt-4">
                <label className="btn btn-ghost btn-sm">
                    <input
                        type="file"
                        className='hidden'
                        id='file-input' // Added ID for resetting
                        onChange={handlefilechange}
                         // Good practice to only accept images
                    />
                    <Image className="h-5 w-5" />
                    Photo
                </label>
                
                {/* 👇 FIX #2: Added onClick handler and loading/disabled state */}
                <button 
                    className={`btn btn-primary btn-sm bg-blue-300${isLoading ? 'btn-disabled' : ''}`}
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <>
                            Post<Send className="h-4 w-4" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default CreatePost;