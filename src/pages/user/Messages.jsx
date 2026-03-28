import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Send, Search, MoreVertical, Phone, Video } from "lucide-react";
import ChatMessage from "../../components/ui/ChatMessage";
import { useAuth } from "../../context/AuthContext";
import { messageApi } from "../../services/api";
import {
  sendMessage as socketSendMessage,
  onMessageReceived,
  onMessageDelivered,
  on as socketOn,
  off as socketOff,
  sendTypingIndicator,
  sendStopTyping,
  onTypingIndicator,
} from "../../services/socketService";

const Messages = () => {
  const { user, refreshData } = useAuth();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});

  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    let mounted = true;

    (async () => {
      setLoadingConversations(true);
      try {
        const res = await messageApi.getConversations();
        if (!mounted) return;
        const list = (res.conversations || []).map((c) => ({
          userId: c._id?.otherUserId || c.user?._id || c.userId,
          participant: c.user || {},
          lastMessage: { text: c.lastMessage || "" },
          unreadCount: c.unreadCount || 0,
        }));
        setConversations(list);

        const newChatUserId = location.state?.newConversationWith;
        if (newChatUserId) {
          setActiveConversationId(newChatUserId);
        } else if (list.length > 0) {
          setActiveConversationId(list[0].userId);
        }
      } catch (err) {
        console.error("Failed to load conversations", err);
      } finally {
        setLoadingConversations(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [location.state, user]);

  const selectedConversation = conversations.find(
    (c) => c.userId === activeConversationId,
  );

  const conversationMessages = messages.filter(
    (m) =>
      (String(m.senderId) === String(selectedConversation?.userId) &&
        String(m.receiverId) === String(user?._id)) ||
      (String(m.senderId) === String(user?._id) &&
        String(m.receiverId) === String(selectedConversation?.userId)),
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationMessages]);

  useEffect(() => {
    if (selectedConversation && user) {
      (async () => {
        try {
          // mark server-side messages as read for this conversation
          const res = await messageApi.getMessages(
            selectedConversation.userId,
            1,
            200,
          );
          const msgs = res.messages || [];
          const unread = msgs.filter(
            (m) => String(m.receiverId) === String(user._id) && !m.isRead,
          );
          await Promise.all(unread.map((m) => messageApi.markAsRead(m._id)));
        } catch (err) {
          // ignore
        }
        refreshData();
      })();
    }
  }, [selectedConversation, user]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !user) return;

    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      _id: tempId,
      senderId: user._id,
      receiverId: selectedConversation.userId,
      text: newMessage,
      message: newMessage,
      timestamp: new Date().toISOString(),
      status: "sending",
    };

    setMessages((prev) => [...prev, optimistic]);

    try {
      socketSendMessage(user._id, selectedConversation.userId, newMessage);
      // backend will emit message:delivered and message:receive; delivered handler will update status
    } catch (err) {
      console.error("Socket send failed", err);
      setMessages((prev) =>
        prev.map((m) => (m._id === tempId ? { ...m, status: "failed" } : m)),
      );
    }

    setNewMessage("");
  };

  const filteredConversations = conversations.filter((c) =>
    c.participant?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Load messages when conversation changes
  useEffect(() => {
    if (!selectedConversation || !user) {
      setMessages([]);
      return;
    }

    let mounted = true;
    setLoadingMessages(true);
    (async () => {
      try {
        const res = await messageApi.getMessages(
          selectedConversation.userId,
          1,
          200,
        );
        if (!mounted) return;
        const msgs = (res.messages || []).map((m) => ({
          _id: m._id,
          senderId: m.senderId._id || m.senderId,
          receiverId: m.receiverId._id || m.receiverId,
          text: m.content || m.message || "",
          message: m.content || m.message || "",
          timestamp: m.createdAt || m.timestamp || new Date().toISOString(),
          isRead: m.isRead,
          status: m.isRead ? "read" : "delivered",
        }));
        setMessages(msgs);
      } catch (err) {
        console.error("Failed loading messages", err);
        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [selectedConversation, user]);

  // Typing indicator (debounced)
  let typingTimeout = null;
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    if (!user || !selectedConversation) return;
    sendTypingIndicator(user._id, selectedConversation.userId);
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      sendStopTyping(user._id, selectedConversation.userId);
    }, 1200);
  };

  // Socket listeners
  useEffect(() => {
    if (!user) return;

    const handleReceive = (data) => {
      const msg = {
        _id: data._id || data.messageId || `msg-${Date.now()}`,
        senderId: data.senderId,
        receiverId: data.receiverId,
        text: data.content || data.message || data.text,
        message: data.content || data.message || data.text,
        timestamp: data.timestamp || data.createdAt || new Date().toISOString(),
        status: "delivered",
      };

      // If message belongs to current conversation, append
      if (
        String(msg.senderId) === String(selectedConversation?.userId) ||
        String(msg.receiverId) === String(selectedConversation?.userId)
      ) {
        setMessages((prev) => [...(prev || []), msg]);
      }
      refreshData();
    };

    const handleDelivered = (data) => {
      const { messageId } = data;
      setMessages((prev) =>
        (prev || []).map((m) => {
          if (m._id === messageId) return { ...m, status: "delivered" };
          // also try match optimistic messages by text and 'sending' status
          if (
            m.status === "sending" &&
            m.text &&
            data.content &&
            m.text === data.content
          ) {
            return { ...m, _id: messageId, status: "delivered" };
          }
          return m;
        }),
      );
    };

    const handleTyping = (data) => {
      const { senderId, isTyping } = data;
      setTypingUsers((prev) => ({ ...prev, [senderId]: isTyping }));
    };

    onMessageReceived(handleReceive);
    onMessageDelivered(handleDelivered);
    onTypingIndicator(handleTyping);

    // also listen for explicit read confirmations
    const handleReadConfirmation = (data) => {
      const { messageId } = data;
      setMessages((prev) =>
        (prev || []).map((m) =>
          m._id === messageId ? { ...m, status: "read" } : m,
        ),
      );
    };

    socketOn("message:read:confirmation", handleReadConfirmation);

    return () => {
      socketOff("message:receive", handleReceive);
      socketOff("message:delivered", handleDelivered);
      socketOff("message:typing", handleTyping);
      socketOff("message:read:confirmation", handleReadConfirmation);
    };
  }, [user, selectedConversation]);

  return (
    <div className="h-[calc(100vh-7rem)] animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full flex">
        {/* LEFT SIDE - Conversations */}

        <div className="w-full md:w-80 border-r border-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <h1 className="text-xl font-bold text-gray-900 mb-3">Messages</h1>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-primary-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="text-center text-gray-400 mt-10">
                No conversations
              </div>
            ) : (
              filteredConversations.map((conversation) => {
                const participant = conversation.participant;

                return (
                  <div
                    key={conversation.userId}
                    onClick={() => setActiveConversationId(conversation.userId)}
                    className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
                      activeConversationId === conversation.userId
                        ? "bg-gray-50"
                        : ""
                    }`}
                  >
                    <img
                      src={participant?.avatar || "/default-avatar.png"}
                      alt={participant?.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {participant?.name}
                      </p>

                      <p className="text-xs text-gray-500 truncate">
                        {conversation.lastMessage?.text || "Start conversation"}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT SIDE - Chat Window */}

        <div className="hidden md:flex flex-1 flex-col">
          {selectedConversation ? (
            <>
              {/* Header */}

              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Link
                    to={`/user/user-details/${selectedConversation.userId}`}
                  >
                    <img
                      src={
                        selectedConversation.participant?.avatar ||
                        "/default-avatar.png"
                      }
                      alt={selectedConversation.participant?.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </Link>

                  <h3 className="font-semibold text-gray-900">
                    {selectedConversation.participant?.name}
                    {typingUsers[selectedConversation.userId] && (
                      <span className="text-sm text-gray-500 font-normal ml-2">
                        typing...
                      </span>
                    )}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <Phone className="w-5 h-5" />
                  </button>

                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <Video className="w-5 h-5" />
                  </button>

                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}

              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {conversationMessages.map((message) => (
                  <ChatMessage
                    key={message._id}
                    message={message}
                    isOwn={String(message.senderId) === String(user?._id)}
                    avatar={selectedConversation.participant?.avatar}
                  />
                ))}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}

              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-gray-100 bg-white"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={handleInputChange}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-primary-500 focus:outline-none transition-all"
                  />

                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="p-3 bg-linear-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Your Messages
                </h3>

                <p className="text-gray-500">
                  Select a conversation to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
