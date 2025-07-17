import { create } from "zustand";

import toast from "react-hot-toast";

import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      console.log("Fetching users...");
      const response = await axiosInstance.get("/message/users");
      console.log("Users fetched successfully:", response.data);
      set({ users: response.data });
    } catch (error) {
      console.error("Error fetching users:", error);

      // Don't show error toast for 401 (unauthorized) - user not logged in
      if (error.response?.status !== 401) {
        toast.error("Failed to fetch users. Please try again.");
      }
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const response = await axiosInstance.get(`/message/${userId}`);
      set({ messages: response.data });
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to fetch messages. Please try again.");
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      // Create FormData to handle file uploads
      const formData = new FormData();

      // Add text if provided
      if (messageData.text) {
        formData.append("text", messageData.text);
      }

      // Handle image upload if provided
      if (messageData.image) {
        formData.append("image", messageData.image);
      }

      const response = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      set({ messages: [...messages, response.data.data] });
      toast.success("Message sent successfully!");
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error("Error sending message:", error);
    }
  },
  deleteMessage: async (messageId) => {
    const { messages } = get();
    try {
      await axiosInstance.delete(`/message/delete/${messageId}`);
      // Remove the message from local state
      set({ messages: messages.filter((msg) => msg._id !== messageId) });
      toast.success("Message deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete message. Please try again.");
      console.error("Error deleting message:", error);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    // Listen for new messages
    socket.on("newMessage", (newMessage) => {
      const { selectedUser: currentSelectedUser } = get();
      // Only add message if it's for the currently selected conversation
      if (
        currentSelectedUser &&
        (newMessage.senderId._id === currentSelectedUser._id ||
          newMessage.recieverId._id === currentSelectedUser._id)
      ) {
        set({
          messages: [...get().messages, newMessage],
        });
      }
    });

    // Listen for message deletions
    socket.on("messageDeleted", (deletedMessageId) => {
      const { messages } = get();
      set({
        messages: messages.filter((msg) => msg._id !== deletedMessageId),
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");
    socket.off("messageDeleted");
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },
}));
