import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8080";

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(userId) {
    if (this.socket?.connected) return this.socket;

    this.socket = io(BASE_URL, {
      query: {
        userId: userId,
      },
      withCredentials: true,
    });

    this.socket.on("connect", () => {
      console.log("Connected to server with socket ID:", this.socket.id);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Disconnected from server. Reason:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  getSocket() {
    return this.socket;
  }
}

export const socketService = new SocketService();
