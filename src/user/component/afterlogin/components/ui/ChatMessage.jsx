const ChatMessage = ({ message, isOwn, showAvatar = true, avatar }) => {

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className={`flex gap-3 mb-4 ${isOwn ? 'flex-row-reverse' : ''}`}>

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
      <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>

        <div
          className={`px-4 py-2.5 rounded-2xl ${
            isOwn
              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-tr-sm'
              : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'
          }`}
        >
          <p className="text-sm leading-relaxed">
            {message.text || message.message}
          </p>
        </div>

        <span className={`text-xs text-gray-400 mt-1 ${isOwn ? 'text-right' : ''}`}>
          {message.timestamp
            ? formatTime(message.timestamp)
            : message.time}
        </span>

      </div>

    </div>
  )
}

export default ChatMessage