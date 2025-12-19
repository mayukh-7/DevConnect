import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useProfileStore = create((set, get) => ({
    profileUser: null,
    posts: [],
    isLoading: false,

    fetchProfile: async (username) => {
        set({ isLoading: true });
        try {
            // 1. Fetch the user's profile
            const res = await axiosInstance.get(`/users/c/${username}`);
            const user = res.data.data; // Get the user from the response
            set({ profileUser: user }); // Set the user in state

            // 👇 FIX: Use 'user._id' from the response, not 'profileUser._id'
            const userId = user._id; 

            // 2. Fetch the user's posts
            const res2 = await axiosInstance.get(`/posts/user/${userId}`);
            set({ posts: res2.data.data });

        } catch (error) {
            toast.error(error.response?.data?.message || "User not found");
        } finally {
            set({ isLoading: false });
        }
    },


    toggleFollow: async () => {
        const { profileUser } = get();
        const authUser = useAuthStore.getState().authUser;
        
        if (!profileUser || !authUser) return;

        try {
            await axiosInstance.post(`/users/follow/${profileUser._id}`);

            // Update the local state for the profile page
            const isFollowing = profileUser.followers.includes(authUser._id);
            let newFollowers;

            if (isFollowing) {
                newFollowers = profileUser.followers.filter(id => id !== authUser._id);
            } else {
                newFollowers = [...profileUser.followers, authUser._id];
            }

            set({
                profileUser: { ...profileUser, followers: newFollowers }
            });

        } catch (error) {
            toast.error("Failed to update follow status");
        }
    }
}));