'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { ChatMessage, ChatRoom, ClientToServerEvents, ServerToClientEvents } from '@/types/socket'
import { useAuth } from './AuthContext'

interface ChatContextType {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null
  messages: ChatMessage[]
  currentRoom: string
  availableRooms: ChatRoom[]
  isConnected: boolean
  sendMessage: (content: string, replyToId?: string) => void
  joinRoom: (roomId: string) => void
  addReaction: (messageId: string, emoji: string) => void
  removeReaction: (messageId: string, emoji: string) => void
  searchMessages: (query: string) => void
  uploadFile: (file: File) => void
  isTyping: string[]
  startTyping: () => void
  stopTyping: () => void
  searchResults: ChatMessage[]
  clearSearch: () => void
  sendPrivateMessage: (content: string, recipientUsername: string) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

interface ChatProviderProps {
  children: React.ReactNode
}

export function ChatProvider({ children }: ChatProviderProps) {
  const { user } = useAuth()
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentRoom, setCurrentRoom] = useState<string>('general')
  const [availableRooms, setAvailableRooms] = useState<ChatRoom[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isTyping, setIsTyping] = useState<string[]>([])
  const [searchResults, setSearchResults] = useState<ChatMessage[]>([])
  const [privateMessages, setPrivateMessages] = useState<ChatMessage[]>([])
  const [isInitialized, setIsInitialized] = useState(false) // Prevent multiple connections

  // Get username for display
  const getUsername = () => {
    if (user?.name) return user.name
    if (user?.email) return user.email.split('@')[0]
    return `Guest ${Math.floor(Math.random() * 1000)}`
  }

  useEffect(() => {
    // Prevent creating multiple connections
    if (socket || isInitialized) {
      console.log('Socket already exists or initialized, skipping connection')
      return
    }

    console.log('🔌 Initializing new socket connection...')
    setIsInitialized(true)
    
    // Initialize socket connection
    const socketInstance = io(process.env.NODE_ENV === 'production' 
      ? process.env.NEXTAUTH_URL || ''
      : 'http://localhost:3000', {
      path: '/api/socket/io',
      addTrailingSlash: false,
      transports: ['polling', 'websocket'], // Try polling first, then websocket
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      autoConnect: true,
      forceNew: false, // Don't force new connection if one exists
    })

    // Connection events
    const onConnect = () => {
      console.log('✅ Connected to chat server')
      setIsConnected(true)
      // Room joining is now handled in separate useEffect
    }

    const onDisconnect = () => {
      console.log('❌ Disconnected from chat server')
      setIsConnected(false)
    }

    const onConnectError = (error: any) => {
      console.error('❌ Connection error:', error)
      setIsConnected(false)
    }

    const onReceiveMessage = (message: ChatMessage) => {
      setMessages(prev => [...prev, message])
    }

    const onUserTyping = (data: { username: string }) => {
      setIsTyping(prev => {
        if (!prev.includes(data.username)) {
          return [...prev, data.username]
        }
        return prev
      })
    }

    const onUserStopTyping = (data: { username: string }) => {
      setIsTyping(prev => prev.filter(user => user !== data.username))
    }

    const onReactionAdded = ({ messageId, reaction }: { messageId: string; reaction: any }) => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, reactions: [...msg.reactions, reaction] }
          : msg
      ))
    }

    const onReactionRemoved = ({ messageId, reaction }: { messageId: string; reaction: any }) => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, reactions: msg.reactions.filter(r => r.id !== reaction.id) }
          : msg
      ))
    }

    const onSearchResults = ({ results }: { results: ChatMessage[] }) => {
      setSearchResults(results)
    }

    const onFileUploaded = ({ message }: { message: ChatMessage }) => {
      setMessages(prev => [...prev, message])
    }

    const onReceivePrivateMessage = (message: ChatMessage) => {
      setPrivateMessages(prev => [...prev, message])
    }

    const onError = (error: any) => {
      console.error('Chat error:', error)
    }

    socketInstance.on('connect', onConnect)
    socketInstance.on('disconnect', onDisconnect)
    socketInstance.on('connect_error', onConnectError)
    socketInstance.on('receive_message', onReceiveMessage)
    socketInstance.on('user_typing', onUserTyping)
    socketInstance.on('user_stop_typing', onUserStopTyping)
    socketInstance.on('reaction_added', onReactionAdded)
    socketInstance.on('reaction_removed', onReactionRemoved)
    socketInstance.on('search_results', onSearchResults)
    socketInstance.on('file_uploaded', onFileUploaded)
    socketInstance.on('receive_private_message', onReceivePrivateMessage)
    socketInstance.on('error', onError)

    setSocket(socketInstance)

    // Load available rooms (independent of connection)
    loadAvailableRooms()

    return () => {
      socketInstance.off('connect', onConnect)
      socketInstance.off('disconnect', onDisconnect)
      socketInstance.off('connect_error', onConnectError)
      socketInstance.off('receive_message', onReceiveMessage)
      socketInstance.off('user_typing', onUserTyping)
      socketInstance.off('user_stop_typing', onUserStopTyping)
      socketInstance.off('reaction_added', onReactionAdded)
      socketInstance.off('reaction_removed', onReactionRemoved)
      socketInstance.off('search_results', onSearchResults)
      socketInstance.off('file_uploaded', onFileUploaded)
      socketInstance.off('receive_private_message', onReceivePrivateMessage)
      socketInstance.off('error', onError)
      console.log('🔌 Disconnecting socket...')
      socketInstance.disconnect()
      setSocket(null)
      setIsConnected(false)
      setIsInitialized(false) // Allow reconnection if component remounts
    }
  }, []) // Remove currentRoom dependency

  // Separate effect for room changes
  useEffect(() => {
    if (socket && isConnected) {
      console.log('🏠 Joining room:', currentRoom)
      socket.emit('join_room', currentRoom)
      loadChatHistory()
    }
  }, [currentRoom, socket, isConnected]) // Only depend on room changes and socket state

  const loadChatHistory = async () => {
    try {
      const response = await fetch(`/api/chat/messages?limit=50&roomId=${currentRoom}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      } else {
        console.warn('Failed to load chat history, setting empty messages')
        setMessages([])
      }
    } catch (error) {
      console.error('Error loading chat history:', error)
      setMessages([])
    }
  }

  const loadAvailableRooms = async () => {
    try {
      const response = await fetch('/api/chat/rooms')
      if (response.ok) {
        const data = await response.json()
        setAvailableRooms(data.rooms || [])
      } else {
        console.warn('Failed to load chat rooms, using default room')
        setAvailableRooms([{ 
          id: 'general', 
          name: 'general', 
          description: 'General chat', 
          isPrivate: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }])
      }
    } catch (error) {
      console.error('Error loading chat rooms:', error)
      setAvailableRooms([{ 
        id: 'general', 
        name: 'general', 
        description: 'General chat', 
        isPrivate: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }])
    }
  }

  const sendMessage = (content: string, replyToId?: string) => {
    if (!socket || !content.trim()) {
      console.warn('Cannot send message: socket not connected or empty content')
      return
    }

    if (!isConnected) {
      console.warn('Cannot send message: not connected to server')
      return
    }

    const username = getUsername()
    const userId = user?.id

    console.log('📤 Sending message:', { content, username, userId, roomId: currentRoom })

    socket.emit('send_message', {
      content: content.trim(),
      username,
      userId,
      roomId: currentRoom,
      replyToId
    })
  }

  const joinRoom = (roomId: string) => {
    if (!socket) return
    
    socket.emit('join_room', roomId)
    setCurrentRoom(roomId)
    setMessages([]) // Clear messages when switching rooms
  }

  const addReaction = (messageId: string, emoji: string) => {
    if (!socket) return

    socket.emit('add_reaction', {
      messageId,
      emoji,
      username: getUsername(),
      userId: user?.id
    })
  }

  const removeReaction = (messageId: string, emoji: string) => {
    if (!socket) return

    socket.emit('remove_reaction', {
      messageId,
      emoji,
      username: getUsername()
    })
  }

  const searchMessages = (query: string) => {
    if (!socket || !query.trim()) {
      console.warn('Cannot search: socket not connected or empty query')
      return
    }

    if (!isConnected) {
      console.warn('Cannot search: not connected to server')
      return
    }

    console.log('🔍 Searching for:', query, 'in room:', currentRoom)

    socket.emit('search_messages', {
      query: query.trim(),
      roomId: currentRoom
    })
  }

  const uploadFile = async (file: File) => {
    if (!socket) return

    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      if (response.ok) {
        const data = await response.json()
        
        // Send the file info via socket
        socket.emit('send_message', {
          content: `📎 Shared a file: ${data.fileName}`,
          fileUrl: data.fileUrl,
          fileName: data.fileName,
          fileType: data.fileType,
          username: getUsername(),
          userId: user?.id,
          roomId: currentRoom
        })
      } else {
        console.error('Failed to upload file')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }

  const startTyping = () => {
    if (!socket) return
    socket.emit('typing', { username: getUsername(), roomId: currentRoom })
  }

  const stopTyping = () => {
    if (!socket) return
    socket.emit('stop_typing', { username: getUsername(), roomId: currentRoom })
  }

  const clearSearch = () => {
    setSearchResults([])
  }

  const sendPrivateMessage = (content: string, recipientUsername: string) => {
    if (!socket || !content.trim()) return

    const username = getUsername()
    const userId = user?.id

    // For now, send as a regular message with @mention since private messaging isn't implemented in socket types
    const privateContent = `@${recipientUsername} ${content.trim()}`
    
    socket.emit('send_message', {
      content: privateContent,
      username,
      userId,
      roomId: currentRoom
    })
  }

  return (
    <ChatContext.Provider value={{
      socket,
      messages,
      currentRoom,
      availableRooms,
      isConnected,
      sendMessage,
      joinRoom,
      addReaction,
      removeReaction,
      searchMessages,
      uploadFile,
      isTyping,
      startTyping,
      stopTyping,
      searchResults,
      clearSearch,
      sendPrivateMessage
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
