import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  user: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],

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
  signup: async (formData) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post("/signup", formData);

      set({ user: response.data });
      toast.success("Signed up successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to sign up. Please try again."
      );
      set({ user: null });
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (formData) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post("/login", formData);
      set({ user: response.data });
      toast.success("Logged in successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to log in. Please try again."
      );
      set({ user: null });
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/logout");
      set({ user: null });
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Failed to log out. Please try again.");
    }
  },
  updateProfile: async (formData) => {
    set({ isUpdatingProfile: true });
    try {
      const response = await axiosInstance.put("/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set({ user: response.data.user });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);

      // Handle specific error codes
      if (error.response?.status === 413) {
        toast.error("Image is too large. Please choose a smaller image.");
      } else if (error.response?.status === 400) {
        toast.error(error.response?.data?.message || "Invalid image format.");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to update profile. Please try again."
        );
      }
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  deleteAccount: async () => {
    try {
      await axiosInstance.delete("/delete");
      set({ user: null });
      toast.success("Account deleted successfully!");
      // Clear any stored authentication data
      localStorage.removeItem("theme");
    } catch (error) {
      console.error("Account deletion error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to delete account. Please try again."
      );
    }
  },
}));
