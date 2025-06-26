'use client'

import { useState, useEffect, useRef } from 'react'
import { useChat } from '@/contexts/ChatContext'
import { useAuth } from '@/contexts/AuthContext'
import { ChatMessage } from '@/types/socket'
import { formatDistanceToNow } from 'date-fns'

interface PrivateMessageProps {
  isOpen: boolean
  onCloseAction: () => void
  recipientUsername: string
}

export default function PrivateMessage({ isOpen, onCloseAction, recipientUsername }: PrivateMessageProps) {
  const { user } = useAuth()
  const { sendPrivateMessage, isConnected: chatConnected, messages } = useChat()
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Get filtered private messages
  const privateMessages = messages.filter(m => 
    (m.recipientUsername === recipientUsername && m.username === getCurrentUsername()) ||
    (m.username === recipientUsername && m.recipientUsername === getCurrentUsername())
  )

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [privateMessages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Mock connection status
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    sendPrivateMessage(inputMessage, recipientUsername)
    setInputMessage('')
  }

  const getCurrentUsername = () => {
    if (user?.name) return user.name
    if (user?.email) return user.email.split('@')[0]
    return `Guest ${Math.floor(Math.random() * 1000)}`
  }

  const formatMessageTime = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 left-4 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-purple-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${chatConnected ? 'bg-green-400' : 'bg-red-400'}`} />
          <h3 className="font-semibold text-sm">Private Chat</h3>
          <span className="text-xs opacity-75">
            with {recipientUsername}
          </span>
        </div>
        <button
          onClick={onCloseAction}
          className="p-1 hover:bg-purple-700 rounded"
          aria-label="Close private chat"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto p-3 space-y-3">
        {privateMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Start your private conversation with {recipientUsername}
          </div>
        ) : (
          privateMessages.map((message) => {
            const isOwn = message.username === getCurrentUsername()
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg text-sm ${
                  isOwn 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                }`}>
                  <p className="break-words">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    isOwn ? 'text-purple-200' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {formatMessageTime(message.createdAt)}
                  </p>
                </div>
              </div>
            )
          })
        )}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <span>{recipientUsername} is typing</span>
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-3">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={chatConnected ? "Type a private message..." : "Connecting..."}
            disabled={!chatConnected}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 disabled:opacity-50"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!chatConnected || !inputMessage.trim()}
            className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send private message"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          🔒 Private conversation with {recipientUsername}
        </p>
      </div>
    </div>
  )
}
