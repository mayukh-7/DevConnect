import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";
import { useProfileStore } from "./useProfileStore.js";
// 'get' is provided by Zustand to access the store's own state
export const usePostStore = create((set, get) => ({
    posts: [],
    isLoading: false,
    isLoadingDelete: false,
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
            const authUser = useAuthStore.getState().authUser;
            if (!authUser) return toast.error("You must be logged in to like a post");

            const userId = authUser._id;

            // Call the backend API
            await axiosInstance.patch(`/posts/like/${postId}`);

            // This is the helper function to update a post's likes
            const updatePostLikes = (post) => {
                if (post._id === postId) {
                    const isLiked = post.likes.includes(userId);
                    const newLikes = isLiked
                        ? post.likes.filter((id) => id !== userId) // Unlike
                        : [...post.likes, userId]; // Like
                    
                    return { ...post, likes: newLikes };
                }
                return post;
            };

            // 1. UPDATE THE MAIN FEED STORE (usePostStore)
            const updatedFeedPosts = get().posts.map(updatePostLikes);
            set({ posts: updatedFeedPosts });

            // 2. UPDATE THE PROFILE PAGE STORE (useProfileStore)
            const { posts: profilePosts } = useProfileStore.getState();
            const updatedProfilePosts = profilePosts.map(updatePostLikes);
            useProfileStore.setState({ posts: updatedProfilePosts });

        } catch (error) {
            toast.error(error.response?.data?.message || "Like failed");
        }
    },

    addComment: async (postId, text) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.post(`/posts/comment/${postId}`, { text });
            const newCommentData = res.data.data;
            const authUser = useAuthStore.getState().authUser;
            
            const newPopulatedComment = {
                ...newCommentData,
                createdBy: {
                    _id: authUser._id,
                    username: authUser.username,
                    ProfilePic: authUser.ProfilePic
                }
            };

            // This is the helper function to update a post's comments
            const updatePostComments = (post) => {
                if (post._id === postId) {
                    return {
                        ...post,
                        comments: [newPopulatedComment, ...post.comments]
                    };
                }
                return post;
            };

            // 2. UPDATE THE MAIN FEED STORE (usePostStore)
            const updatedFeedPosts = get().posts.map(updatePostComments);
            set({ posts: updatedFeedPosts });

            // 3. UPDATE THE PROFILE PAGE STORE (useProfileStore)
            const { posts: profilePosts } = useProfileStore.getState();
            const updatedProfilePosts = profilePosts.map(updatePostComments);
            useProfileStore.setState({ posts: updatedProfilePosts });

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add comment");
        } finally {
            set({ isLoading: false });
        }
    },

    deletePost: async(postId)=>{
        set({isLoadingDelete:true});
        try {
             await axiosInstance.delete(`/posts/${postId}`);
            set({posts: get().posts.filter(p=>p._id !== postId)})
            toast.success("Post deleted successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to Delete Posts");
        }finally{
            set({isLoadingDelete: false});
        }
    }
}));