'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { ChatMessage, ClientToServerEvents, ServerToClientEvents } from '@/types/socket'
import { useAuth } from './AuthContext'

interface ChatContextType {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null
  messages: ChatMessage[]
  isConnected: boolean
  sendMessage: (content: string) => void
  isTyping: string[]
  startTyping: () => void
  stopTyping: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

interface ChatProviderProps {
  children: React.ReactNode
}

export function ChatProvider({ children }: ChatProviderProps) {
  const { user, status } = useAuth()
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isTyping, setIsTyping] = useState<string[]>([])

  // Get username for display
  const getUsername = () => {
    if (user?.name) return user.name
    if (user?.email) return user.email.split('@')[0]
    return `Guest ${Math.floor(Math.random() * 1000)}`
  }

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io(process.env.NODE_ENV === 'production' 
      ? process.env.NEXTAUTH_URL || ''
      : 'http://localhost:3000', {
      path: '/api/socket/io',
      addTrailingSlash: false,
    })

    // Connection events
    socketInstance.on('connect', () => {
      console.log('Connected to chat server')
      setIsConnected(true)
    })

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from chat server')
      setIsConnected(false)
    })

    // Message events
    socketInstance.on('receive_message', (message: ChatMessage) => {
      setMessages(prev => [...prev, message])
    })

    // Typing events
    socketInstance.on('user_typing', (data) => {
      setIsTyping(prev => {
        if (!prev.includes(data.username)) {
          return [...prev, data.username]
        }
        return prev
      })
    })

    socketInstance.on('user_stop_typing', (data) => {
      setIsTyping(prev => prev.filter(user => user !== data.username))
    })

    // Error handling
    socketInstance.on('error', (error) => {
      console.error('Chat error:', error)
    })

    setSocket(socketInstance)

    // Load chat history
    loadChatHistory()

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  const loadChatHistory = async () => {
    try {
      const response = await fetch('/api/chat/messages?limit=50')
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Error loading chat history:', error)
    }
  }

  const sendMessage = (content: string) => {
    if (!socket || !content.trim()) return

    const username = getUsername()
    // Use the user ID from our custom auth context
    const userId = user?.id || user?.email

    socket.emit('send_message', {
      content: content.trim(),
      username,
      userId
    })
  }

  const startTyping = () => {
    if (!socket) return
    socket.emit('typing', { username: getUsername() })
  }

  const stopTyping = () => {
    if (!socket) return
    socket.emit('stop_typing', { username: getUsername() })
  }

  return (
    <ChatContext.Provider value={{
      socket,
      messages,
      isConnected,
      sendMessage,
      isTyping,
      startTyping,
      stopTyping
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
