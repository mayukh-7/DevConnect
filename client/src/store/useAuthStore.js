import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set,get)=>({
    authUser: null,
    isSigningUp: false, 
    isLoggingIn: false,
    isCheckingAuth: true,
    isUpdatingProfile: false,
    checkAuth: async()=>{
        try {
            const res = await axiosInstance.get("/users/me");
            set({authUser: res.data.data});
        } catch (error) {
            console.log("Error in checkAuth:", error);
            set({authUser: null});
        }finally {
            set({isCheckingAuth: false});
        }
    },
    login: async(data)=>{
        set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/users/login",data);
      
      set({ authUser: res.data.data.user });
      // console.log(res.data)
      toast.success("Logged in successfully");

    } catch (error) {
      toast.error(error.response.data.message);
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
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/users/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  signup: async(data)=>{
    set({isSigningUp: true});
    try {
      const res = await axiosInstance.post("/users/register",data);
      console.log(res.data)
      set({authUser: res.data.data});
      toast.success("Account Created successfully")
      return true;
    } catch (error) {
      toast.error(error.response.data.message);
      return false;
    }finally{
      set({isSigningUp: false});
    }
  }

}));
