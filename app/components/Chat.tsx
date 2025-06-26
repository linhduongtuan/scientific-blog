'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@/contexts/ChatContext'
import { useAuth } from '@/contexts/AuthContext'
import { formatDistanceToNow } from 'date-fns'
import { ChatMessage } from '@/types/socket'
import ChatModerationPanel from './ChatModerationPanel'
import PrivateMessage from './PrivateMessage'
import { ClientOnly } from './ClientOnly'

// Emoji picker component
const EmojiPicker = ({ onEmojiSelect, onClose }: { onEmojiSelect: (emoji: string) => void, onClose: () => void }) => {
  const emojis = ['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '🔥', '💯', '👏']
  
  return (
    <div className="absolute bottom-12 right-6 bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl p-4 shadow-2xl z-20 w-72 max-h-80 overflow-hidden">
      <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
        ✨ Quick Reactions
        <button
          onClick={onClose}
          className="ml-auto p-1 hover:bg-gray-200/60 dark:hover:bg-gray-700/60 rounded-full transition-all duration-200 hover:scale-105"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {emojis.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onEmojiSelect(emoji)}
            className="aspect-square p-3 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 rounded-xl text-2xl transition-all duration-300 hover:scale-125 hover:shadow-lg hover:rotate-6 active:scale-95 transform-gpu"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}

// Room selector component
const RoomSelector = ({ currentRoom, availableRooms, onRoomChange }: {
  currentRoom: string
  availableRooms: any[]
  onRoomChange: (roomId: string) => void
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Default rooms fallback
  const defaultRooms = [
    { id: 'general', name: 'general', description: 'General discussion for all topics', isPrivate: false, createdAt: new Date(), updatedAt: new Date() },
    { id: 'tech', name: 'tech-talk', description: 'Technology discussions', isPrivate: false, createdAt: new Date(), updatedAt: new Date() },
    { id: 'help', name: 'help-support', description: 'Get help from the community', isPrivate: false, createdAt: new Date(), updatedAt: new Date() }
  ]
  
  const roomsToShow = availableRooms.length > 0 ? availableRooms : defaultRooms
  const currentRoomData = roomsToShow.find(room => room.id === currentRoom || room.name === currentRoom)
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation()
          console.log('Room selector clicked, isOpen:', isOpen, 'rooms:', roomsToShow)
          setIsOpen(!isOpen)
        }}
        className="flex items-center space-x-2 text-sm text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 backdrop-blur-sm border border-white/20"
      >
        <div className="relative">
          <div className="w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse shadow-lg"></div>
          <div className="absolute inset-0 w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-ping opacity-30"></div>
        </div>
        <span className="font-semibold tracking-wide text-xs">#{currentRoomData?.name || currentRoom}</span>
        <svg className={`w-3 h-3 transition-all duration-300 ${isOpen ? 'rotate-180 scale-110' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[90]" 
            onClick={() => setIsOpen(false)}
          />
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-2 bg-white/98 dark:bg-gray-800/98 backdrop-blur-xl border-2 border-blue-200 dark:border-blue-600 rounded-2xl shadow-2xl z-[100] min-w-64 overflow-hidden animate-in slide-in-from-top-2 duration-300">
            <div className="p-4">
              <div className="text-xs font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text uppercase tracking-wider mb-3 flex items-center gap-2">
                🏠 Available Rooms ({roomsToShow.length})
              </div>
              <div className="space-y-1">
                {roomsToShow.map((room) => (
                  <button
                    key={room.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      console.log('Room selected:', room.id, room.name)
                      onRoomChange(room.id)
                      setIsOpen(false)
                    }}
                    className={`group w-full text-left p-3 rounded-xl text-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                      (room.id === currentRoom || room.name === currentRoom) 
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-300/50 dark:border-blue-500/50 shadow-inner' 
                        : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/50 dark:hover:from-gray-700/50 dark:hover:to-blue-900/20 border border-transparent hover:border-blue-200/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`relative w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        (room.id === currentRoom || room.name === currentRoom) 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg' 
                          : 'bg-gray-300 dark:bg-gray-600 group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400'
                      }`}>
                        {(room.id === currentRoom || room.name === currentRoom) && (
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping opacity-30"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold transition-colors duration-200 text-xs ${
                          (room.id === currentRoom || room.name === currentRoom) 
                            ? 'text-blue-700 dark:text-blue-300' 
                            : 'text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                        }`}>
                          #{room.name}
                        </div>
                        {room.description && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                            {room.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Search component
const SearchComponent = ({ onSearch, searchResults, onClearSearch }: {
  onSearch: (query: string) => void
  searchResults: ChatMessage[]
  onClearSearch: () => void
}) => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🔍 Search button clicked - query:', query)
    
    if (!query.trim()) {
      console.warn('Cannot search: query is empty')
      return
    }

    try {
      onSearch(query.trim())
      setIsOpen(true)
      console.log('✅ Search request sent')
    } catch (error) {
      console.error('❌ Search failed:', error)
    }
  }

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="flex">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search messages..."
            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition-all duration-200"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <button
          type="submit"
          onClick={(e) => {
            console.log('🔍 Search button clicked (onClick) - query:', query)
          }}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-r-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Search
        </button>
      </form>

      {isOpen && searchResults.length > 0 && (
        <div className="absolute top-12 left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl max-h-80 overflow-hidden z-30 backdrop-blur-sm">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-750">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Search Results ({searchResults.length})</span>
            <button
              onClick={() => {
                setIsOpen(false)
                onClearSearch()
              }}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              ✕
            </button>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {searchResults.map((message) => (
              <div key={message.id} className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200 cursor-pointer">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {message.username?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{message.username}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <div className="text-sm text-gray-900 dark:text-gray-100 line-clamp-2">
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Enhanced message component with reactions, replies, and file sharing
const MessageBubble = ({ message, onAddReaction, onRemoveReaction, onReply, onPrivateMessage }: {
  message: ChatMessage
  onAddReaction: (messageId: string, emoji: string) => void
  onRemoveReaction: (messageId: string, emoji: string) => void
  onReply: (message: ChatMessage) => void
  onPrivateMessage: (username: string) => void
}) => {
  const { user } = useAuth()
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  
  const getCurrentUsername = () => {
    if (user?.name) return user.name
    if (user?.email) return user.email.split('@')[0]
    return `Guest ${Math.floor(Math.random() * 1000)}`
  }
  
  const isOwn = message.username === getCurrentUsername()

  const handleEmojiSelect = (emoji: string) => {
    onAddReaction(message.id, emoji)
    setShowEmojiPicker(false)
  }

  const handleReactionClick = (emoji: string) => {
    const currentUsername = getCurrentUsername()
    const userReaction = message.reactions.find(r => r.emoji === emoji && r.username === currentUsername)
    
    if (userReaction) {
      onRemoveReaction(message.id, emoji)
    } else {
      onAddReaction(message.id, emoji)
    }
  }

  // Group reactions by emoji
  const groupedReactions = message.reactions.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = []
    }
    acc[reaction.emoji].push(reaction)
    return acc
  }, {} as Record<string, typeof message.reactions>)

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group relative mb-6 animate-in slide-in-from-bottom-2 duration-300`}>
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'} relative`}>
        {/* Reply indicator */}
        {message.replyToId && (
          <div className="mb-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl border-l-4 border-gradient-to-b from-blue-400 to-purple-400 text-xs backdrop-blur-sm">
            <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-semibold">↩️ Replying to message</span>
          </div>
        )}
        
        {/* User avatar and name for other users */}
        {!isOwn && (
          <div className="flex items-center space-x-3 mb-2">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg ring-2 ring-white/50 dark:ring-gray-800/50">
                {message.username?.[0]?.toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"></div>
            </div>
            <div>
              <span className="font-bold text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {message.username}
              </span>
              <div className="text-xs text-gray-500 dark:text-gray-400 opacity-80">
                {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
              </div>
            </div>
          </div>
        )}
        
        <div className={`relative px-5 py-4 rounded-3xl text-sm shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] transform-gpu ${
          isOwn 
            ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 text-white rounded-br-xl shadow-blue-500/20' 
            : 'bg-gradient-to-br from-white via-gray-50 to-blue-50/30 dark:from-gray-800 dark:via-gray-700 dark:to-blue-900/20 text-gray-900 dark:text-gray-100 rounded-bl-xl border border-white/20 dark:border-gray-600/30 backdrop-blur-sm'
        } relative overflow-hidden`}>
          
          {/* Magical sparkle effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-2 right-3 w-1 h-1 bg-white/40 rounded-full animate-pulse"></div>
            <div className="absolute bottom-3 left-4 w-0.5 h-0.5 bg-white/30 rounded-full animate-ping"></div>
          </div>
          
          {/* File attachment */}
          {message.fileUrl && (
            <div className="mb-4">
              {message.fileType?.startsWith('image/') ? (
                <div className="relative group cursor-pointer overflow-hidden rounded-2xl">
                  <img 
                    src={message.fileUrl} 
                    alt={message.fileName}
                    className="max-w-full h-auto transition-all duration-300 group-hover:scale-105 shadow-lg"
                    onClick={() => window.open(message.fileUrl, '_blank')}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                    <span className="text-white text-xs font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">Click to view full size</span>
                  </div>
                </div>
              ) : (
                <a 
                  href={message.fileUrl}
                  download={message.fileName}
                  className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50/50 dark:from-gray-600 dark:to-blue-800/30 rounded-2xl border border-gray-200/50 dark:border-gray-500/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group"
                >
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{message.fileName}</span>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Click to download</div>
                  </div>
                </a>
              )}
            </div>
          )}
          
          <p className="break-words leading-relaxed relative z-10">{message.content}</p>
          
          {isOwn && (
            <div className="flex items-center justify-end mt-3">
              <p className="text-xs font-medium text-blue-200/80">
                {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                {message.isEdited && <span className="ml-1 opacity-75">(edited)</span>}
              </p>
            </div>
          )}

          {/* Floating action buttons */}
          <div className={`absolute ${isOwn ? '-left-12' : '-right-12'} top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100`}>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
                title="Add reaction"
              >
                <span className="text-lg">😊</span>
              </button>
              <button
                onClick={() => onReply(message)}
                className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
                title="Reply"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </button>
              <button
                onClick={() => onPrivateMessage(message.username)}
                className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
                title="Private message"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Emoji picker */}
          {showEmojiPicker && (
            <EmojiPicker 
              onEmojiSelect={handleEmojiSelect}
              onClose={() => setShowEmojiPicker(false)}
            />
          )}
        </div>

        {/* Enhanced Reactions */}
        {Object.keys(groupedReactions).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 ml-3">
            {Object.entries(groupedReactions).map(([emoji, reactions]) => {
              const currentUsername = getCurrentUsername()
              const userReacted = reactions.some(r => r.username === currentUsername)
              
              return (
                <button
                  key={emoji}
                  onClick={() => handleReactionClick(emoji)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm transition-all duration-300 hover:scale-110 active:scale-95 shadow-md hover:shadow-lg ${
                    userReacted
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-blue-500/30'
                      : 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-800/50 dark:hover:to-purple-800/50 text-gray-700 dark:text-gray-300'
                  }`}
                  title={reactions.map(r => r.username).join(', ')}
                >
                  <span className="text-lg">{emoji}</span>
                  <span className="font-semibold">{reactions.length}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

interface ChatProps {
  isOpen: boolean
  onCloseAction: () => void
}

export default function Chat({ isOpen, onCloseAction }: ChatProps) {
  const { user } = useAuth()
  const { 
    messages, sendMessage, isConnected, isTyping, startTyping, stopTyping,
    currentRoom, availableRooms, joinRoom, addReaction, removeReaction,
    searchMessages, uploadFile, searchResults, clearSearch
  } = useChat()
  const [mounted, setMounted] = useState(false)
  const [inputMessage, setInputMessage] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null)
  const [showModerationPanel, setShowModerationPanel] = useState(false)
  const [showPrivateMessage, setShowPrivateMessage] = useState(false)
  const [privateMessageRecipient, setPrivateMessageRecipient] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Check if user has moderation permissions
  const canModerate = user?.email?.includes('admin') || user?.name?.toLowerCase().includes('admin')

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen, isMinimized])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('📤 Send button clicked - message:', inputMessage, 'connected:', isConnected)
    
    if (!inputMessage.trim()) {
      console.warn('Cannot send: message is empty')
      return
    }

    if (!isConnected) {
      console.error('Cannot send: not connected to chat server')
      return
    }

    try {
      sendMessage(inputMessage, replyTo?.id)
      setInputMessage('')
      setReplyTo(null)
      stopTyping()
      console.log('✅ Message sent successfully')
    } catch (error) {
      console.error('❌ Error sending message:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value)
    
    // Handle typing indicators
    startTyping()
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    
    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping()
    }, 1000)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    console.log('📎 File upload triggered:', file?.name, file?.type, file?.size)
    
    if (!file) {
      console.warn('No file selected')
      return
    }

    if (!isConnected) {
      console.error('Cannot upload: not connected to chat server')
      alert('Cannot upload file: Not connected to chat server')
      return
    }

    if (!uploadFile) {
      console.error('Upload function not available')
      alert('Upload function not available')
      return
    }

    try {
      console.log('📎 Starting file upload process...')
      await uploadFile(file)
      
      // Clear the input after successful upload
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      console.log('✅ File upload completed successfully')
    } catch (error) {
      console.error('❌ File upload failed:', error)
      alert('File upload failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const handleReply = (message: ChatMessage) => {
    setReplyTo(message)
    inputRef.current?.focus()
  }

  const handlePrivateMessage = (username: string) => {
    setPrivateMessageRecipient(username)
    setShowPrivateMessage(true)
  }

  const formatMessageTime = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  }

  const getCurrentUsername = () => {
    if (user?.name) return user.name
    if (user?.email) return user.email.split('@')[0]
    return `Guest ${Math.floor(Math.random() * 1000)}`
  }

  if (!mounted || !isOpen) return null

  return (
    <ClientOnly fallback={<div className="fixed bottom-6 right-6 w-[380px] h-14 bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-2xl z-50 animate-pulse"></div>}>
      <div className={`fixed bottom-6 right-6 w-[380px] bg-gradient-to-br from-white/90 via-white/95 to-gray-50/90 dark:from-gray-900/90 dark:via-gray-900/95 dark:to-gray-800/90 backdrop-blur-2xl border border-white/30 dark:border-gray-700/30 rounded-3xl shadow-2xl z-50 transition-all duration-700 ease-out transform-gpu ${
        isMinimized ? 'h-14 hover:shadow-xl' : 'h-[580px] hover:shadow-3xl hover:scale-[1.01]'
      } ring-1 ring-black/5 dark:ring-white/5 overflow-visible`}>
      {/* Magical Header */}
      <div className="relative flex items-center justify-between p-4 border-b border-white/20 dark:border-gray-700/30 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-t-3xl overflow-visible">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-2 left-4 w-3 h-3 bg-white/40 rounded-full animate-bounce delay-100"></div>
          <div className="absolute top-4 right-8 w-2 h-2 bg-white/30 rounded-full animate-bounce delay-300"></div>
          <div className="absolute bottom-3 left-8 w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce delay-500"></div>
        </div>
        
        <div className="relative flex items-center space-x-3 z-10 flex-1 min-w-0 overflow-visible">
          <div className="relative">
            <div className={`w-4 h-4 rounded-full transition-all duration-500 ${
              isConnected 
                ? 'bg-gradient-to-r from-green-400 to-emerald-400 shadow-lg shadow-green-400/50' 
                : 'bg-gradient-to-r from-red-400 to-rose-400 shadow-lg shadow-red-400/50'
            }`} />
            {isConnected && (
              <div className="absolute inset-0 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-ping opacity-40"></div>
            )}
          </div>
          <RoomSelector 
            currentRoom={currentRoom}
            availableRooms={availableRooms}
            onRoomChange={joinRoom}
          />
          <div className="flex items-center gap-2 text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full border border-white/30">
            <span className="font-semibold">{messages.length}</span>
            {!isConnected && (
              <span className="text-red-200 animate-pulse">⚠️ Offline</span>
            )}
          </div>
        </div>
        
        <div className="relative flex items-center space-x-1 z-10 flex-shrink-0">
          {/* Search toggle button */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg backdrop-blur-sm border border-white/20 group ${
              showSearch ? 'bg-white/30 text-white' : 'hover:bg-white/20 text-white/80'
            }`}
            aria-label="Toggle search"
            title="Search messages"
          >
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          {canModerate && (
            <button
              onClick={() => setShowModerationPanel(true)}
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg backdrop-blur-sm border border-white/20 group"
              aria-label="Open moderation panel"
              title="Moderation"
            >
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </button>
          )}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg backdrop-blur-sm border border-white/20 group"
            aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
          >
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMinimized ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              )}
            </svg>
          </button>
          <button
            onClick={onCloseAction}
            className="p-2 hover:bg-red-500/80 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg backdrop-blur-sm border border-white/20 group"
            aria-label="Close chat"
          >
            <svg className="w-4 h-4 group-hover:scale-110 group-hover:rotate-90 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Search Bar - Only show when search is toggled */}
          {showSearch && (
            <div className="p-3 border-b border-gray-200/50 dark:border-gray-700/30 bg-gradient-to-r from-gray-50/50 to-blue-50/30 dark:from-gray-800/50 dark:to-blue-900/30">
              <SearchComponent 
                onSearch={searchMessages}
                searchResults={searchResults}
                onClearSearch={clearSearch}
              />
            </div>
          )}

          {/* Reply indicator */}
          {replyTo && (
            <div className="p-3 bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-900/30 dark:to-purple-900/30 border-b border-blue-200/50 dark:border-blue-700/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">↩️ Replying to {replyTo.username}:</span>
                  <span className="text-gray-600 dark:text-gray-300 truncate max-w-48">{replyTo.content}</span>
                </div>
                <button
                  onClick={() => setReplyTo(null)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Magical Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1 relative" style={{ height: showSearch || replyTo ? 'calc(100% - 160px)' : 'calc(100% - 100px)', scrollbarWidth: 'thin', scrollbarColor: '#3B82F6 transparent' }}>
            {/* Custom scrollbar styles */}
            <style jsx>{`
              div::-webkit-scrollbar {
                width: 6px;
              }
              div::-webkit-scrollbar-track {
                background: transparent;
              }
              div::-webkit-scrollbar-thumb {
                background: linear-gradient(to bottom, #3B82F6, #8B5CF6);
                border-radius: 3px;
              }
              div::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(to bottom, #2563EB, #7C3AED);
              }
            `}</style>
            
            {(searchResults || messages).length === 0 ? (
              <div className="text-center py-16 animate-in fade-in duration-700">
                <div className="relative mx-auto w-24 h-24 mb-6">
                  {/* Magical floating elements */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full opacity-20 animate-pulse"></div>
                  <div className="absolute inset-2 bg-gradient-to-br from-blue-300 via-purple-400 to-pink-400 rounded-full opacity-30 animate-pulse delay-150"></div>
                  <div className="absolute inset-4 bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-800 dark:via-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center shadow-2xl border border-white/50 dark:border-gray-700/50">
                    <svg className="w-10 h-10 text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text animate-bounce" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  
                  {/* Floating sparkles */}
                  <div className="absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce delay-300"></div>
                  <div className="absolute -bottom-1 -left-2 w-2 h-2 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full animate-bounce delay-500"></div>
                  <div className="absolute top-1/2 -right-4 w-1.5 h-1.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-ping"></div>
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
                  {searchResults ? '🔍 No messages found' : '✨ Start the Magic'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 max-w-xs mx-auto leading-relaxed">
                  {searchResults 
                    ? 'Try different search terms to find what you\'re looking for' 
                    : 'Be the first to share your thoughts and spark an amazing conversation!'
                  }
                </p>
                <div className="flex justify-center space-x-2 mt-4">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            ) : (
              (searchResults || messages).map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  onAddReaction={addReaction}
                  onRemoveReaction={removeReaction}
                  onReply={handleReply}
                  onPrivateMessage={handlePrivateMessage}
                />
              ))
            )}
            
            {/* Enhanced Typing indicators */}
            {isTyping.length > 0 && (
              <div className="flex justify-start mb-6 animate-in slide-in-from-left-2 duration-300">
                <div className="bg-gradient-to-r from-gray-100 via-white to-gray-100 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 px-5 py-4 rounded-3xl text-sm text-gray-600 dark:text-gray-300 shadow-lg border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm">
                  <div className="flex items-center space-x-3">
                    <div className="flex -space-x-2">
                      {isTyping.slice(0, 3).map((username, index) => (
                        <div key={username} className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-gray-700 shadow-sm">
                          {username[0]?.toUpperCase()}
                        </div>
                      ))}
                    </div>
                    <div>
                      <span className="font-semibold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                        {isTyping.slice(0, 2).join(', ')}
                        {isTyping.length > 2 && ` +${isTyping.length - 2} more`}
                      </span>
                      <span className="ml-1">{isTyping.length === 1 ? 'is' : 'are'} typing</span>
                    </div>
                    <div className="flex space-x-1.5">
                      <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-bounce shadow-sm" style={{animationDelay: '0ms'}}></div>
                      <div className="w-2.5 h-2.5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-bounce shadow-sm" style={{animationDelay: '150ms'}}></div>
                      <div className="w-2.5 h-2.5 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full animate-bounce shadow-sm" style={{animationDelay: '300ms'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Magical Chat Input Area */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-white/20 dark:border-gray-700/30 p-3 bg-gradient-to-r from-gray-50/90 via-white/95 to-gray-50/90 dark:from-gray-800/90 dark:via-gray-900/95 dark:to-gray-800/90 backdrop-blur-xl rounded-b-3xl">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <div className="flex-1 relative">
                {/* Magical input container */}
                <div className="relative flex items-center bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-2xl border-2 border-gray-200/50 dark:border-gray-600/50 p-2 focus-within:border-gradient-to-r focus-within:from-blue-400 focus-within:via-purple-400 focus-within:to-pink-400 transition-all duration-300 shadow-lg hover:shadow-xl focus-within:shadow-2xl backdrop-blur-sm group">
                  {/* Input field */}
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={handleInputChange}
                    placeholder={isConnected ? "✨ Share your thoughts..." : "🔄 Connecting..."}
                    disabled={!isConnected}
                    className="flex-1 px-3 py-2 bg-transparent text-sm focus:outline-none dark:text-gray-100 disabled:opacity-50 placeholder-gray-500 dark:placeholder-gray-400 font-medium"
                    maxLength={500}
                  />
                  
                  {/* File upload button */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                    id="chat-file-input"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      console.log('📎 Attach button clicked - connected:', isConnected)
                      if (fileInputRef.current) {
                        fileInputRef.current.click()
                      } else {
                        console.error('File input ref is null')
                      }
                    }}
                    disabled={!isConnected}
                    className="p-2.5 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 disabled:opacity-50 rounded-xl hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 transition-all duration-300 hover:scale-110 active:scale-95 group"
                    title="Upload file"
                    aria-label="Upload file"
                  >
                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Magical send button */}
              <button
                type="submit"
                disabled={!isConnected || !inputMessage.trim()}
                onClick={(e) => {
                  console.log('📤 Send button clicked (onClick) - message:', inputMessage, 'connected:', isConnected)
                }}
                className="relative px-4 py-2.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 hover:scale-110 active:scale-95 transform-gpu group overflow-hidden"
                aria-label="Send message"
              >
                {/* Sparkle effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute top-1 left-2 w-1 h-1 bg-white rounded-full animate-ping"></div>
                  <div className="absolute bottom-1 right-3 w-0.5 h-0.5 bg-white rounded-full animate-pulse"></div>
                </div>
                
                <svg className="w-5 h-5 relative z-10 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
            
            {/* Enhanced footer info */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-3">
                {user ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {getCurrentUsername()[0]?.toUpperCase()}
                    </div>
                    <p className="text-xs font-medium text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                      Chatting as {getCurrentUsername()}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <span className="animate-pulse">🌟</span>
                    Sign in for a magical experience
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-3 text-xs">
                <div className="flex items-center space-x-2">
                  <span className={`transition-colors duration-300 ${
                    inputMessage.length > 400 ? 'text-orange-500 font-bold' : 
                    inputMessage.length > 300 ? 'text-yellow-600' : 'text-gray-400'
                  }`}>
                    {inputMessage.length}/500
                  </span>
                  <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 shadow-sm ${
                    isConnected 
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse' 
                      : 'bg-gradient-to-r from-red-400 to-rose-500 animate-bounce'
                  }`}></div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Moderation Panel */}
      {showModerationPanel && (
        <ChatModerationPanel
          isOpen={showModerationPanel}
          onCloseAction={() => setShowModerationPanel(false)}
          currentRoom={currentRoom}
        />
      )}

      {/* Private Message */}
      {showPrivateMessage && (
        <PrivateMessage
          isOpen={showPrivateMessage}
          onCloseAction={() => setShowPrivateMessage(false)}
          recipientUsername={privateMessageRecipient}
        />
      )}
      </div>
    </ClientOnly>
  )
}
