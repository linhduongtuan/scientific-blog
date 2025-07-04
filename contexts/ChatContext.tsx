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
      // Test connection by emitting a ping
      socketInstance.emit('ping')
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
      console.log('📨 Received new message from socket:', message)
      
      try {
        // Ensure the message has all required properties
        const formattedMessage = {
          ...message,
          reactions: message.reactions || [],
          isSystem: message.isSystem ?? false,
          isEdited: message.isEdited ?? false,
          isPrivate: message.isPrivate ?? false,
          createdAt: message.createdAt instanceof Date ? message.createdAt : new Date(message.createdAt),
          updatedAt: message.updatedAt instanceof Date ? message.updatedAt : new Date(message.updatedAt)
        }
        
        // Only update messages if this message is for the current room
        if (formattedMessage.roomId === currentRoom) {
          setMessages(prev => {
            // Check if message already exists to avoid duplicates
            const messageExists = prev.some(m => m.id === formattedMessage.id);
            
            if (messageExists) {
              console.log('📨 Message already exists in state, not adding duplicate:', formattedMessage.id);
              return prev;
            }
            
            const newMessages = [...prev, formattedMessage];
            console.log('📨 Updated messages array, now has', newMessages.length, 'messages', 
              'Latest message:', formattedMessage.content);
            return newMessages;
          });
        } else {
          console.log('📨 Message is for a different room:', formattedMessage.roomId, 
            'Current room:', currentRoom);
        }
        
      } catch (error) {
        console.error('Error processing received message:', error);
      }
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

    const onPong = () => {
      console.log('🏓 Pong received - connection is working')
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
    socketInstance.on('pong', onPong)

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
      socketInstance.off('pong', onPong)
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
      console.log('📚 Loading chat history for room:', currentRoom)
      const response = await fetch(`/api/chat/messages?limit=50&roomId=${currentRoom}`)
      if (response.ok) {
        const data = await response.json()
        console.log('📚 Loaded', data.messages?.length || 0, 'messages for room:', currentRoom)
        
        if (data.messages && data.messages.length > 0) {
          console.log('📝 First message sample:', data.messages[0])
          console.log('📝 Last message sample:', data.messages[data.messages.length - 1])
        } else {
          console.log('⚠️ No messages returned from API for room:', currentRoom)
        }
        
        if (!Array.isArray(data.messages)) {
          console.error('❌ API returned invalid data format - messages is not an array:', data)
          setMessages([])
          return
        }
        
        // Transform messages to include username for display and ensure all required fields exist
        const transformedMessages = (data.messages || []).map((msg: any) => ({
          ...msg,
          username: msg.user?.name || msg.user?.email?.split('@')[0] || 'Anonymous',
          reactions: msg.reactions || [],
          isSystem: msg.isSystem ?? false,
          isEdited: msg.isEdited ?? false,
          isPrivate: msg.isPrivate ?? false,
          createdAt: new Date(msg.createdAt),
          updatedAt: new Date(msg.updatedAt)
        }))
        
        console.log('📚 Setting messages array with', transformedMessages.length, 'messages')
        setMessages(transformedMessages)
      } else {
        console.warn('Failed to load chat history for room:', currentRoom, '- Status:', response.status)
        setMessages([])
      }
    } catch (error) {
      console.error('Error loading chat history for room:', currentRoom, '- Error:', error)
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
    if (!content.trim()) {
      console.warn('Cannot send message: empty content')
      return
    }

    if (!socket) {
      console.error('Cannot send message: socket not initialized')
      return
    }

    if (!isConnected) {
      console.error('Cannot send message: not connected to server')
      return
    }

    const username = getUsername()
    const userId = user?.id || 'anonymous'

    console.log('📤 Sending message:', { content, username, userId, roomId: currentRoom, replyToId })

    try {
      // Create a temporary optimistic message that will be replaced when server confirms
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      const tempMessage: ChatMessage = {
        id: tempId,
        content: content.trim(),
        username,
        userId,
        roomId: currentRoom,
        replyToId,
        createdAt: new Date(),
        updatedAt: new Date(),
        reactions: [],
        isSystem: false,
        isEdited: false,
        isPrivate: false
      }
      
      // Add optimistic message to state first for immediate feedback
      // Uncomment this if you want optimistic updates:
      // setMessages(prev => [...prev, tempMessage]);
      
      socket.emit('send_message', {
        content: content.trim(),
        username,
        userId,
        roomId: currentRoom,
        replyToId
      })
      console.log('✅ Message sent to socket server:', content.substring(0, 30))
    } catch (error) {
      console.error('❌ Failed to send message:', error)
    }
  }

  const joinRoom = (roomId: string) => {
    if (!socket) {
      console.warn('Cannot join room: socket not initialized')
      return
    }
    
    console.log('🏠 Switching to room:', roomId, 'from:', currentRoom)
    
    // First clear current messages immediately for visual feedback
    setMessages([])
    setSearchResults([]) // Also clear search results
    
    // Then update the room and emit the join event
    setCurrentRoom(roomId)
    socket.emit('join_room', roomId)
    
    // Messages will be loaded by the useEffect that watches currentRoom changes
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
    if (!query.trim()) {
      console.warn('Cannot search: empty query')
      return
    }

    if (!socket) {
      console.error('Cannot search: socket not initialized')
      return
    }

    if (!isConnected) {
      console.error('Cannot search: not connected to server')
      return
    }

    console.log('🔍 Searching for:', query, 'in room:', currentRoom)

    try {
      socket.emit('search_messages', {
        query: query.trim(),
        roomId: currentRoom
      })
      console.log('✅ Search request sent successfully')
    } catch (error) {
      console.error('❌ Failed to search messages:', error)
    }
  }

  const uploadFile = async (file: File) => {
    if (!socket) {
      console.error('Cannot upload file: socket not initialized')
      return
    }

    if (!isConnected) {
      console.error('Cannot upload file: not connected to server')
      return
    }

    console.log('📎 Starting file upload:', file.name, file.type, file.size)

    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ File uploaded successfully:', data)
        
        // Send the file info via socket
        const username = getUsername()
        const userId = user?.id || 'anonymous'
        
        socket.emit('send_message', {
          content: `📎 Shared a file: ${data.fileName}`,
          fileUrl: data.fileUrl,
          fileName: data.fileName,
          fileType: data.fileType,
          username,
          userId,
          roomId: currentRoom
        })
        console.log('✅ File message sent successfully')
      } else {
        const errorData = await response.json()
        console.error('❌ Failed to upload file:', errorData)
        throw new Error(errorData.error || 'Upload failed')
      }
    } catch (error) {
      console.error('❌ Error uploading file:', error)
      // You might want to show an error message to the user here
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
