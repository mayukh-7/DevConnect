// src/store/useSearchStore.js
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useSearchStore = create((set) => ({
    searchResults: [],
    isSearching: false,

    searchUsers: async (query) => {
        if (!query.trim()) {
            set({ searchResults: [] });
            return;
        }

        set({ isSearching: true });
        try {
            const res = await axiosInstance.get(`/users/search/${query}`);
            set({ searchResults: res.data.data });
        } catch (error) {
            console.error("Search error:", error);
            set({ searchResults: [] });
        } finally {
            set({ isSearching: false });
        }
    },

    clearSearch: () => set({ searchResults: [], isSearching: false }),
}));