'use client'

import { useState } from 'react'
import Chat from '@/app/components/Chat'

export default function ChatDemoPage() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Enhanced Chat System Demo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Experience all the advanced chat features in action
          </p>
          <button
            onClick={() => setIsChatOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Open Chat System
          </button>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">💬</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Chat Rooms</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Join different topic-based chat rooms for focused discussions
            </p>
            <ul className="mt-3 text-sm text-gray-500 dark:text-gray-500">
              <li>• General discussion</li>
              <li>• Scientific topics</li>
              <li>• Tech talk</li>
              <li>• Help & support</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">😊</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Message Reactions</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              React to messages with emojis and see real-time reactions
            </p>
            <div className="mt-3 flex flex-wrap gap-1">
              {['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '🔥'].map(emoji => (
                <span key={emoji} className="text-lg">{emoji}</span>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">📎</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">File Sharing</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Share images, documents, and other files seamlessly
            </p>
            <ul className="mt-3 text-sm text-gray-500 dark:text-gray-500">
              <li>• Image preview</li>
              <li>• Document download</li>
              <li>• File type detection</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">🔒</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Private Messages</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Send private messages to specific users for confidential discussions
            </p>
            <ul className="mt-3 text-sm text-gray-500 dark:text-gray-500">
              <li>• One-on-one chats</li>
              <li>• Encrypted messaging</li>
              <li>• Separate chat windows</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">🔍</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Message Search</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Search through message history to find specific conversations
            </p>
            <ul className="mt-3 text-sm text-gray-500 dark:text-gray-500">
              <li>• Full-text search</li>
              <li>• User filtering</li>
              <li>• Date range options</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">🛡️</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Moderation Tools</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Advanced moderation capabilities for admins and moderators
            </p>
            <ul className="mt-3 text-sm text-gray-500 dark:text-gray-500">
              <li>• Delete messages</li>
              <li>• Ban/warn users</li>
              <li>• Moderation logs</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">↩️</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Reply Threading</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Reply to specific messages to create threaded conversations
            </p>
            <ul className="mt-3 text-sm text-gray-500 dark:text-gray-500">
              <li>• Message context</li>
              <li>• Thread visualization</li>
              <li>• Easy navigation</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">⚡</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Real-time Features</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Live updates and real-time interaction indicators
            </p>
            <ul className="mt-3 text-sm text-gray-500 dark:text-gray-500">
              <li>• Typing indicators</li>
              <li>• Live message updates</li>
              <li>• Connection status</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">🎨</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Rich UI/UX</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Beautiful, responsive interface with dark/light mode support
            </p>
            <ul className="mt-3 text-sm text-gray-500 dark:text-gray-500">
              <li>• Responsive design</li>
              <li>• Dark mode support</li>
              <li>• Smooth animations</li>
            </ul>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            How to Test the Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Basic Chat</h3>
              <ol className="list-decimal list-inside text-gray-600 dark:text-gray-400 space-y-1">
                <li>Click "Open Chat System" to open the chat window</li>
                <li>Type a message and press Enter to send</li>
                <li>Switch between different chat rooms using the dropdown</li>
                <li>Try the search functionality to find messages</li>
              </ol>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Advanced Features</h3>
              <ol className="list-decimal list-inside text-gray-600 dark:text-gray-400 space-y-1">
                <li>Hover over messages to see reaction and reply buttons</li>
                <li>Click the emoji button to add reactions</li>
                <li>Use the reply button to respond to specific messages</li>
                <li>Click the private message button for 1-on-1 chats</li>
              </ol>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">File Sharing</h3>
              <ol className="list-decimal list-inside text-gray-600 dark:text-gray-400 space-y-1">
                <li>Click the attachment button next to the message input</li>
                <li>Select an image or document to share</li>
                <li>Images will show previews, documents will be downloadable</li>
                <li>All files are stored securely and shared instantly</li>
              </ol>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Moderation (Admin Only)</h3>
              <ol className="list-decimal list-inside text-gray-600 dark:text-gray-400 space-y-1">
                <li>Admin users will see a shield icon in the chat header</li>
                <li>Click it to open the moderation panel</li>
                <li>View all messages, users, and moderation actions</li>
                <li>Delete messages, warn or ban users as needed</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Component */}
      <Chat 
        isOpen={isChatOpen}
        onCloseAction={() => setIsChatOpen(false)}
      />
    </div>
  )
}
