import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useAuthStore = create((set) => ({
  user: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/check");
      set({ user: response.data });
    } catch (error) {
      console.error("Error checking authentication:", error);
      set({ user: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
