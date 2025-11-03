import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";
// 'get' is provided by Zustand to access the store's own state
export const usePostStore = create((set, get) => ({
    posts: [],
    isLoading: false,

    createPost: async (formData) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.post("/posts/create", formData);


            const newPost = res.data.data;
            const authUser = useAuthStore.getState().authUser;
            const newPostData = {
                ...newPost, // This has the _id, caption, image, etc.
                createdBy: {   // Manually overwrite/create the createdBy object
                    _id: authUser._id,
                    username: authUser.username,
                    ProfilePic: authUser.ProfilePic
                }
            };
            //   Use get().posts to access the current state
            set({ posts: [newPostData, ...get().posts] });

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
            console.log(error);
            // toast.error(error.response?.data?.message || "Failed to fetch posts");
        } finally {
            set({ isLoading: false });
        }
    },

    toggleLike: async (postId) => {
        try {
            // 2. Get the authUser's ID from the other store
            const authUser = useAuthStore.getState().authUser;
            if (!authUser) return toast.error("You must be logged in to like a post");

            const userId = authUser._id;

            // 3. Call the backend API (this part was correct)
            // We don't need 'res' anymore since we won't use the response
            await axiosInstance.patch(`/posts/like/${postId}`);

            // 4. Manually update the state
            const { posts } = get();
            const updatedPosts = posts.map((post) => {
                // Find the post we liked/unliked
                if (post._id === postId) {
                    // Check if the user ID is already in the likes array
                    const isLiked = post.likes.includes(userId);

                    let newLikes;
                    if (isLiked) {
                        // User already liked it, so remove their ID (unlike)
                        newLikes = post.likes.filter((id) => id !== userId);
                    } else {
                        // User hasn't liked it, so add their ID (like)
                        newLikes = [...post.likes, userId];
                    }

                    // Return a new post object with the updated likes array
                    return { ...post, likes: newLikes };
                }
                // Return all other posts unchanged
                return post;
            });

            // 5. Set the new posts array to the state
            set({ posts: updatedPosts });

        } catch (error) {
            toast.error(error.response?.data?.message || "Like failed");
        }
    }
}));