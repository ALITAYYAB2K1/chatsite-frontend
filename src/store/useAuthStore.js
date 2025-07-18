import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { socketService } from "../lib/socket.js";

export const useAuthStore = create((set, get) => ({
  user: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      // Check if we have a stored token
      const storedToken = localStorage.getItem("auth-token");
      console.log("Stored token exists:", !!storedToken);
      if (storedToken) {
        console.log("Token preview:", storedToken.substring(0, 50) + "...");
      }

      const response = await axiosInstance.get("/check");
      console.log("CheckAuth response:", response.data);

      // Handle both response formats: direct user object or nested user object
      const userData = response.data.user || response.data;
      console.log("Extracted user data from checkAuth:", userData);

      set({ user: userData });
      get().connectSocket();
    } catch (error) {
      // 401 is expected when user is not logged in, don't log as error
      if (error.response?.status === 401) {
        console.log("User not authenticated (expected)");
        // Clear invalid token if checkAuth fails
        localStorage.removeItem("auth-token");
      } else {
        console.error("Error checking authentication:", error);
      }
      set({ user: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (formData) => {
    set({ isSigningUp: true });
    try {
      console.log("Attempting signup with:", formData);
      console.log("Using API URL:", axiosInstance.defaults.baseURL);

      const response = await axiosInstance.post("/signup", formData);
      console.log("Signup response:", response.data);

      // Extract user and token from response
      const userData = response.data.user;
      const token = response.data.token;

      console.log("Extracted user data:", userData);
      console.log("Extracted token:", token);

      // Store token in localStorage
      if (token) {
        localStorage.setItem("auth-token", token);
        console.log("Token stored in localStorage");
      }

      set({ user: userData });
      toast.success("Signed up successfully!");
      get().connectSocket();
    } catch (error) {
      console.error("Signup error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);

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
      console.log("Attempting login with:", formData);
      console.log("Using API URL:", axiosInstance.defaults.baseURL);

      const response = await axiosInstance.post("/login", formData);
      console.log("Login response:", response.data);

      // Extract user and token from response
      const userData = response.data.user;
      const token = response.data.token;

      console.log("Extracted user data:", userData);
      console.log("Extracted token:", token);

      // Store token in localStorage
      if (token) {
        localStorage.setItem("auth-token", token);
        console.log("Token stored in localStorage");
      }

      set({ user: userData });
      toast.success("Logged in successfully!");
      get().connectSocket(); // Connect socket after login
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);

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

      // Clear token from localStorage
      localStorage.removeItem("auth-token");
      console.log("Token removed from localStorage");

      set({ user: null });
      toast.success("Logged out successfully!");
      get().disconnectSocket(); // Disconnect socket on logout
    } catch (error) {
      console.error("Logout error:", error);
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
  connectSocket: () => {
    const { user } = get();
    if (!user || socketService.getSocket()?.connected) return;

    const socket = socketService.connect(user._id);
    set({ socket: socket });

    // Listen for online users updates
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
      console.log("Online users updated:", userIds);
    });

    console.log("Socket connected for user:", user._id);
  },

  disconnectSocket: () => {
    socketService.disconnect();
    set({ socket: null, onlineUsers: [] });
    console.log("Socket disconnected");
  },
}));
