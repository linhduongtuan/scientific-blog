'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ChatMessage, ChatRoom } from '@/types/socket'
import { formatDistanceToNow } from 'date-fns'

interface ModerationAction {
  id: string
  type: 'delete' | 'edit' | 'ban' | 'warn'
  messageId?: string
  userId?: string
  reason: string
  moderatorId: string
  createdAt: Date
}

interface ChatModerationPanelProps {
  isOpen: boolean
  onCloseAction: () => void
  currentRoom: string
}

export default function ChatModerationPanel({ isOpen, onCloseAction, currentRoom }: ChatModerationPanelProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set())
  const [moderationActions, setModerationActions] = useState<ModerationAction[]>([])
  const [activeTab, setActiveTab] = useState<'messages' | 'actions' | 'users'>('messages')
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState<any[]>([])

  // Check if user has moderation permissions (simple check based on user properties)
  const canModerate = user?.email?.includes('admin') || user?.name?.toLowerCase().includes('admin')

  useEffect(() => {
    if (isOpen && canModerate) {
      fetchMessages()
      fetchModerationActions()
      fetchUsers()
    }
  }, [isOpen, currentRoom, canModerate])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/chat/messages?roomId=${currentRoom}&limit=100`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchModerationActions = async () => {
    try {
      const response = await fetch(`/api/chat/moderation?roomId=${currentRoom}`)
      if (response.ok) {
        const data = await response.json()
        setModerationActions(data.actions || [])
      }
    } catch (error) {
      console.error('Failed to fetch moderation actions:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch(`/api/chat/users?roomId=${currentRoom}`)
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  const handleDeleteMessage = async (messageId: string, reason: string) => {
    try {
      const response = await fetch(`/api/chat/moderation/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, reason })
      })

      if (response.ok) {
        setMessages(prev => prev.filter(m => m.id !== messageId))
        fetchModerationActions()
      }
    } catch (error) {
      console.error('Failed to delete message:', error)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedMessages.size === 0) return

    const reason = prompt('Reason for bulk deletion:')
    if (!reason) return

    try {
      const response = await fetch(`/api/chat/moderation/bulk-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messageIds: Array.from(selectedMessages), 
          reason 
        })
      })

      if (response.ok) {
        setMessages(prev => prev.filter(m => !selectedMessages.has(m.id)))
        setSelectedMessages(new Set())
        fetchModerationActions()
      }
    } catch (error) {
      console.error('Failed to bulk delete messages:', error)
    }
  }

  const handleBanUser = async (userId: string, reason: string, duration?: number) => {
    try {
      const response = await fetch(`/api/chat/moderation/ban`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, reason, duration })
      })

      if (response.ok) {
        fetchUsers()
        fetchModerationActions()
      }
    } catch (error) {
      console.error('Failed to ban user:', error)
    }
  }

  const handleWarnUser = async (userId: string, reason: string) => {
    try {
      const response = await fetch(`/api/chat/moderation/warn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, reason })
      })

      if (response.ok) {
        fetchModerationActions()
      }
    } catch (error) {
      console.error('Failed to warn user:', error)
    }
  }

  const filteredMessages = messages.filter(message =>
    message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!canModerate) {
    return null
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-gradient-to-br from-white via-gray-50 to-blue-50/30 dark:from-gray-800 dark:via-gray-900 dark:to-blue-900/30 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/30 w-full max-w-6xl h-5/6 flex flex-col backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/30 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-t-2xl">
          <h2 className="text-xl font-bold tracking-wide flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Chat Moderation Panel
          </h2>
          <button
            onClick={onCloseAction}
            className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-90"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200/50 dark:border-gray-700/30 bg-gradient-to-r from-gray-50/50 to-blue-50/30 dark:from-gray-800/50 dark:to-blue-900/30">
          {[
            { id: 'messages', label: 'Messages', count: filteredMessages.length, icon: '💬' },
            { id: 'actions', label: 'Actions', count: moderationActions.length, icon: '⚡' },
            { id: 'users', label: 'Users', count: users.length, icon: '👥' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-all duration-300 hover:scale-105 flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-white/50 dark:bg-gray-800/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/30 dark:hover:bg-gray-700/30'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                activeTab === tab.id 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'messages' && (
            <div className="h-full flex flex-col">
              {/* Search and Actions */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search messages..."
                    className="flex-1 max-w-md px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                  <div className="flex items-center space-x-2 ml-4">
                    {selectedMessages.size > 0 && (
                      <button
                        onClick={handleBulkDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                      >
                        Delete Selected ({selectedMessages.size})
                      </button>
                    )}
                    <button
                      onClick={fetchMessages}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      Refresh
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages List */}
              <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Loading messages...</p>
                  </div>
                ) : filteredMessages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No messages found
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredMessages.map(message => (
                      <div
                        key={message.id}
                        className={`p-3 border border-gray-200 dark:border-gray-700 rounded-lg ${
                          selectedMessages.has(message.id) ? 'bg-blue-50 dark:bg-blue-900' : 'bg-white dark:bg-gray-750'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <input
                              type="checkbox"
                              checked={selectedMessages.has(message.id)}
                              onChange={(e) => {
                                const newSelected = new Set(selectedMessages)
                                if (e.target.checked) {
                                  newSelected.add(message.id)
                                } else {
                                  newSelected.delete(message.id)
                                }
                                setSelectedMessages(newSelected)
                              }}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-sm text-blue-600 dark:text-blue-400">
                                  {message.username}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                                </span>
                                {message.isEdited && (
                                  <span className="text-xs text-orange-500">(edited)</span>
                                )}
                              </div>
                              <p className="text-sm text-gray-900 dark:text-gray-100 break-words">
                                {message.content}
                              </p>
                              {message.fileUrl && (
                                <div className="mt-2">
                                  <a
                                    href={message.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                  >
                                    📎 {message.fileName}
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => {
                                const reason = prompt('Reason for deletion:')
                                if (reason) handleDeleteMessage(message.id, reason)
                              }}
                              className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                              title="Delete message"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'actions' && (
            <div className="h-full overflow-y-auto p-4">
              <div className="space-y-2">
                {moderationActions.map(action => (
                  <div key={action.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-750">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            action.type === 'delete' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                            action.type === 'ban' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                            action.type === 'warn' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }`}>
                            {action.type.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            by Moderator
                          </span>
                        </div>
                        <p className="text-sm text-gray-900 dark:text-gray-100">{action.reason}</p>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(new Date(action.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="h-full overflow-y-auto p-4">
              <div className="space-y-2">
                {users.map(user => (
                  <div key={user.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-750">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                          {user.name || user.email}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Messages: {user.messageCount || 0} • Joined: {formatDistanceToNow(new Date(user.createdAt || Date.now()), { addSuffix: true })}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            const reason = prompt('Reason for warning:')
                            if (reason) handleWarnUser(user.id, reason)
                          }}
                          className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700"
                        >
                          Warn
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt('Reason for ban:')
                            if (reason) {
                              const duration = prompt('Ban duration in hours (leave empty for permanent):')
                              handleBanUser(user.id, reason, duration ? parseInt(duration) : undefined)
                            }
                          }}
                          className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Ban
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
