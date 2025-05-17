"use client"

import { useState } from 'react'

interface CommentSectionProps {
  postSlug: string
}

interface Comment {
  id: string
  author: string
  date: string
  content: string
  likes: number
  avatar: string
}

// Mock data for demo purposes
const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    author: 'Alex Johnson',
    date: '2025-05-15T10:23:00Z',
    content: 'This is a fantastic article! The explanation of self-attention mechanisms was particularly clear and helpful.',
    likes: 12,
    avatar: 'https://i.pravatar.cc/150?img=11'
  },
  {
    id: '2',
    author: 'Sam Rodriguez',
    date: '2025-05-16T14:48:00Z',
    content: "I've been working with transformer models for a while, but I never fully understood the multi-head attention concept until reading this. Thank you for the clear explanation!",
    likes: 8,
    avatar: 'https://i.pravatar.cc/150?img=12'
  }
]

export default function CommentSection({ postSlug }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS)
  const [newComment, setNewComment] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  
  // Current date and user information
  const currentDate = "2025-05-17 17:03:53"
  const currentUser = "linhduongtuan"
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would authenticate the user
    // Here we just simulate a successful login
    setIsLoggedIn(true)
    setShowLoginForm(false)
  }
  
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newComment.trim()) return
    
    const newCommentObj: Comment = {
      id: Date.now().toString(),
      author: 'Current User',
      date: new Date().toISOString(),
      content: newComment,
      likes: 0,
      avatar: 'https://i.pravatar.cc/150?img=15'
    }
    
    setComments([...comments, newCommentObj])
    setNewComment('')
  }
  
  const handleLike = (commentId: string) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 } 
        : comment
    ))
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Comments ({comments.length})</h2>
      
      {/* Add Comment Form */}
      {isLoggedIn ? (
        <form onSubmit={handleAddComment} className="mb-8">
          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Add a comment
            </label>
            <textarea
              id="comment"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
              disabled={!newComment.trim()}
            >
              Post Comment
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
          {showLoginForm ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setShowLoginForm(false)}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                For demo purposes, any email will work. In a real app, this would authenticate you properly.
              </p>
            </form>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Sign in to join the discussion and leave a comment
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowLoginForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Sign In
                </button>
                <a
                  href="/blog"
                  className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Subscribe
                </a>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Comments List */}
      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map(comment => (
            <div key={comment.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
              <div className="flex items-start">
                <img 
                  src={comment.avatar} 
                  alt={comment.author} 
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{comment.author}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(comment.date)}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">{comment.content}</p>
                  <button 
                    onClick={() => handleLike(comment.id)}
                    className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905v.714L7.5 9h-3a2 2 0 00-2 2v.5" />
                    </svg>
                    <span>Like</span>
                    {comment.likes > 0 && <span className="ml-1">({comment.likes})</span>}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-right">
        <p>Comment system last updated: {currentDate} by {currentUser}</p>
      </div>
    </div>
  )
}