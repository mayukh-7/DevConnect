import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { useProfileStore } from "./useProfileStore.js";
export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  isUpdatingProfile: false,
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/users/me");
      set({ authUser: res.data.data });
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/users/login", data);

      set({ authUser: res.data.data.user });
      // console.log(res.data)
      toast.success("Logged in successfully");

    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/users/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.patch("/users/update-profile", data);
      set({ authUser: res.data.data });
      useProfileStore.setState({ profileUser: res.data.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/users/register", data);
      console.log(res.data)
      set({ authUser: res.data.data });
      toast.success("Account Created successfully")
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  // src/store/useAuthStore.js

  updateProfilePic: async (file) => {
    set({ isUpdatingProfile: true });
    try {
      // 1. Create FormData because we are sending a file
      const formData = new FormData();
      formData.append("ProfilePic", file);

      // 2. Call your backend route
      const res = await axiosInstance.patch("/users/profilepic", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // 3. Update both stores with the new user data (which contains the new image URL)
      set({ authUser: res.data.data });
      useProfileStore.setState({ profileUser: res.data.data });

      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.log("Error updating profile pic:", error);
      toast.error(error.response?.data?.message || "Failed to update profile picture");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

}));
