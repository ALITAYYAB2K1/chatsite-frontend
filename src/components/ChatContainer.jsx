import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore.js";
import ChatHeader from "./ChatHeader.jsx";
import MessageInput from "./MessageInput.jsx";
import MessageSkeleton from "./skeletons/MessageSkeleton.jsx";
import { useAuthStore } from "../store/useAuthStore.js";
import { formatMessageTime } from "../lib/utils.js";
import { Trash2 } from "lucide-react";
function ChatContainer() {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    deleteMessage,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { user } = useAuthStore();
  const messageEndRef = React.useRef(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }

    return () => {
      unsubscribeFromMessages();
    };
  }, [selectedUser?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (messageEndRef.current && messages)
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDeleteMessage = async (messageId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      await deleteMessage(messageId);
    }
  };
  // If messages are loading, show a loading state
  if (isMessagesLoading)
    return (
      <div className="flex-1 flex flex-col overflow-auto ">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );

  return (
    <div className="flex-1 flex flex-col overflow-auto ">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          // Check if message is sent by current user
          const isOwnMessage =
            message.senderId?._id === user._id || message.senderId === user._id;

          return (
            <div
              key={message._id}
              className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}
              ref={messageEndRef}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      isOwnMessage
                        ? user.avatar || "/avatar.png"
                        : selectedUser.avatar || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <div className="chat-bubble flex flex-col relative group">
                {/* Delete button - only show for own messages */}
                {isOwnMessage && (
                  <button
                    onClick={() => handleDeleteMessage(message._id)}
                    className="absolute -top-1 -right-1 btn btn-ghost btn-xs btn-circle opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white"
                    title="Delete message"
                  >
                    <Trash2 size={12} />
                  </button>
                )}

                {message.image && (
                  <img
                    src={message.image}
                    alt="message"
                    className="max-w-xs rounded-lg border border-zinc-700"
                  />
                )}
                {message.text && <p className="ml-2">{message.text}</p>}
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>
      <MessageInput />
    </div>
  );
}

export default ChatContainer;
