import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

// 'get' is provided by Zustand to access the store's own state
export const usePostStore = create((set, get) => ({
    posts: [],
    isLoading: false,

    createPost: async (formData) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.post("/posts/create", formData);

            //  FIX #1: The new post is in res.data.data
            const newPost = res.data.data;
            
            //  FIX #2: Use get().posts to access the current state
            set({ posts: [newPost, ...get().posts] });
            
            toast.success("Post sent successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create post");
        } finally {
            set({ isLoading: false });
        }
    },
    
    fetchPosts: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get("/posts");
            
            //  FIX #3: The posts array is in res.data.data
            set({ posts: res.data.data });

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch posts");
        } finally {
            set({ isLoading: false });
        }
    }
}));