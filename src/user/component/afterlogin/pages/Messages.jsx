
import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Send, Search, MoreVertical, Phone, Video } from 'lucide-react'
import ChatMessage from '../components/ui/ChatMessage'
import { useAuth } from '../../../../context/AuthContext'
import {
  getConversationsForUser,
  getUserMessages,
  sendMessageToStorage,
  markMessagesAsReadByUser,
  getProfiles,
} from '../utils/storage'

const Messages = () => {
  const { user, refreshData } = useAuth()
  const location = useLocation()
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [activeConversationId, setActiveConversationId] = useState(null)

  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (!user) return

    const profiles = getProfiles()
    const userConversations = getConversationsForUser(user.id).map(c => ({
      ...c,
      participant: profiles[c.userId],
    }))
    setConversations(userConversations)

    const userMessages = getUserMessages(user.id)
    setMessages(userMessages)

    // Handle navigation from ProfileView to start a new chat
    const newChatUserId = location.state?.newConversationWith
    if (newChatUserId) {
      setActiveConversationId(newChatUserId)
    } else if (userConversations.length > 0) {
      setActiveConversationId(userConversations[0].userId)
    }
  }, [location.state, user])

  const selectedConversation = conversations.find(c => c.userId === activeConversationId)

  const conversationMessages = messages.filter(
    m =>
      (m.senderId === selectedConversation?.userId && m.receiverId === user?.id) ||
      (m.senderId === user?.id && m.receiverId === selectedConversation?.userId)
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversationMessages])

  useEffect(() => {
    if (selectedConversation && user) {
      markMessagesAsReadByUser(user.id, selectedConversation.userId)
      refreshData()
    }
  }, [selectedConversation, user])

  const handleSendMessage = (e) => {
    e.preventDefault()

    if (!newMessage.trim() || !selectedConversation || !user) return

    const sentMessage = sendMessageToStorage(user.id, selectedConversation.userId, newMessage)
    setMessages(prev => [...prev, sentMessage])

    setNewMessage('')
  }

  const filteredConversations = conversations.filter(c =>
    c.participant?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

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

                const participant = conversation.participant

                return (
                  <div
                    key={conversation.userId}
                    onClick={() => setActiveConversationId(conversation.userId)}
                    className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
                      activeConversationId === conversation.userId ? 'bg-gray-50' : ''
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
                )
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

                  <Link to={`/afterlogin/profile/${selectedConversation.userId}`}>
                    <img
                      src={selectedConversation.participant?.avatar || "/default-avatar.png"}
                      alt={selectedConversation.participant?.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </Link>

                  <h3 className="font-semibold text-gray-900">
                    {selectedConversation.participant?.name}
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
                    key={message.id}
                    message={message}
                    isOwn={message.senderId === user?.id}
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
                    onChange={(e) => setNewMessage(e.target.value)}
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
  )
}

export default Messages
