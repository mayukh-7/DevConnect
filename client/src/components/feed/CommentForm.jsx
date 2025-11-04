import React, { useState } from 'react'
import { usePostStore } from '../../store/usePostStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Send, Loader2 } from 'lucide-react';
const CommentForm = ({postId}) => {
    const [text, setText] = useState("");
    const {addComment, isLoading} = usePostStore();
    const {authUser} = useAuthStore();

    const handleSubmit = async(e)=>{
        e.preventDefault();
        if(text.trim() === "") return;
        await addComment(postId,text);
        setText("")
    }
  return (
    <form className="flex items-center gap-3 w-full mt-4" onSubmit={handleSubmit}>
            {/* User Avatar */}
            <div className="avatar">
                <div className="w-8 h-8 rounded-full">
                    <img 
                        src={authUser?.ProfilePic || `https://ui-avatars.com/api/?name=${authUser?.username}&background=random`} 
                        alt="My profile" 
                    />
                </div>
            </div>
            
            {/* Comment Input */}
            <input
                type="text"
                placeholder="Write a comment..."
                className="input input-bordered w-full rounded-full input-sm"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            
            
            {/* Submit Button */}
            <button 
                type="submit" 
                className={`btn btn-primary btn-sm btn-circle ${isLoading ? 'btn-disabled' : ''}`}
                disabled={isLoading}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Send className="h-4 w-4" />
                )}
            </button>
        </form>
  )
}

export default CommentForm