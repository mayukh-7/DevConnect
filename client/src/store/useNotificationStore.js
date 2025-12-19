import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useNotificationStore = create((set) => ({
    notifications: [],
    isLoading: false,

    getNotifications: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get("/notifications");
            set({ notifications: res.data.data });
        } catch (error) {
            console.log(error);
        } finally {
            set({ isLoading: false });
        }
    },
    
    clearNotifications: async () => {
        try {
            await axiosInstance.delete("/notifications");
            set({ notifications: [] });
        } catch (error) { console.log(error); }
    }
}));