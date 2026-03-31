import { Check } from "lucide-react";

const ChatMessage = ({
  message,
  isOwn,
  showAvatar = true,
  avatar,
  onEdit,
  onDelete,
}) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Use the same colors for received messages as sending messages per user request
  const bubbleStyle = {
    backgroundColor: "var(--chat-own-bg, #0f172a)",
    color: "var(--chat-own-text, #ffffff)",
  };

  const timeStyle = {
    color: "var(--chat-timestamp, #9ca3af)",
  };

  return (
    <div className={`group flex gap-3 mb-4 ${isOwn ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      {showAvatar && !isOwn && (
        <img
          src={avatar}
          alt="User"
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
      )}

      {!showAvatar && !isOwn && <div className="w-8 flex-shrink-0" />}

      {/* Message Bubble */}
      <div
        className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"} flex flex-col`}
      >
        <div
          className="px-4 py-2.5 rounded-2xl break-words max-w-full relative"
          style={bubbleStyle}
        >
          <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
            {message.text || message.message || ""}
          </p>

          {isOwn && (onEdit || onDelete) && (
            <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <button
                  onClick={() => onEdit(message)}
                  className="p-1 rounded text-xs bg-white/20 hover:bg-white/30"
                  type="button"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(message)}
                  className="p-1 rounded text-xs bg-white/20 hover:bg-white/30"
                  type="button"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>

        <div
          className={`flex items-center gap-2 mt-1 ${isOwn ? "justify-end" : ""}`}
        >
          <span className="text-xs" style={timeStyle}>
            {message.timestamp ? formatTime(message.timestamp) : message.time}
          </span>

          {isOwn && (
            <span className="text-xs flex items-center gap-1" style={timeStyle}>
              {/* status ticks: sending, delivered, read */}
              {message.status === "sending" && <span>...</span>}
              {message.status === "failed" && (
                <span className="text-red-500">!</span>
              )}
              {message.status === "delivered" && <Check className="w-4 h-4" />}
              {message.status === "read" && (
                <div className="flex -space-x-1">
                  <Check className="w-4 h-4 text-primary-500" />
                  <Check className="w-4 h-4 text-primary-500" />
                </div>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
