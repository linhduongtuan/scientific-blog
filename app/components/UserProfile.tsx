"use client"

import { useState, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useNotifications } from './NotificationSystem'

interface UserProfileProps {
  user: {
    id: string
    name: string
    email: string
    image?: string
    role: string
    subscribed: boolean
    createdAt: string
  }
  onUpdate?: () => void
}

export default function UserProfile({ user, onUpdate }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name || '',
    bio: '',
    website: '',
    twitter: '',
    linkedin: '',
    github: '',
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addNotification } = useNotifications()

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      addNotification({
        type: 'error',
        title: 'File too large',
        message: 'Please select an image smaller than 5MB'
      })
      return
    }

    setIsUploading(true)
    
    try {
      // In a real app, you'd upload to a service like Cloudinary or AWS S3
      // For now, we'll simulate the upload
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      addNotification({
        type: 'success',
        title: 'Profile photo updated',
        message: 'Your profile photo has been updated successfully'
      })
      
      onUpdate?.()
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Upload failed',
        message: 'Failed to upload profile photo. Please try again.'
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSave = async () => {
    try {
      // In a real app, you'd make an API call to update the user profile
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsEditing(false)
      addNotification({
        type: 'success',
        title: 'Profile updated',
        message: 'Your profile has been updated successfully'
      })
      
      onUpdate?.()
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Update failed',
        message: 'Failed to update profile. Please try again.'
      })
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
      case 'PREMIUM':
        return 'bg-gold-100 text-gold-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32"></div>
      
      {/* Profile Content */}
      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="relative -mt-16 mb-4">
          <div className="relative inline-block">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-800"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {getInitials(user.name)}
              </div>
            )}
            
            {/* Upload overlay */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white"
            >
              {isUploading ? (
                <LoadingSpinner />
              ) : (
                <CameraIcon className="w-8 h-8" />
              )}
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* User Info */}
        <div className="space-y-4">
          {/* Name and Role */}
          <div className="flex items-center justify-between">
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="text-2xl font-bold bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 outline-none dark:text-white"
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.name}
                </h1>
              )}
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(user.role)}`}>
                  {user.role}
                </span>
                {user.subscribed && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    Premium
                  </span>
                )}
              </div>
            </div>
            
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium"
            >
              {isEditing ? 'Save' : 'Edit Profile'}
            </button>
          </div>

          {/* Email */}
          <div>
            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Bio */}
          {isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Tell us about yourself..."
              />
            </div>
          )}

          {/* Social Links */}
          {isEditing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="https://yourwebsite.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Twitter
                </label>
                <input
                  type="text"
                  value={formData.twitter}
                  onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="@username"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  LinkedIn
                </label>
                <input
                  type="text"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="linkedin.com/in/username"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  GitHub
                </label>
                <input
                  type="text"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="github.com/username"
                />
              </div>
            </div>
          )}

          {/* Cancel button when editing */}
          {isEditing && (
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsEditing(false)
                  setFormData({
                    name: user.name || '',
                    bio: '',
                    website: '',
                    twitter: '',
                    linkedin: '',
                    github: '',
                  })
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CameraIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function LoadingSpinner() {
  return (
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
  )
}