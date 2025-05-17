"use client"

import { useState, FormEvent } from 'react'

interface FormData {
  email: string
  researchInterest: string
  experience: string
  specificTopics: string
  privacyConsent: boolean
}

export default function SubscriptionForm() {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    email: '',
    researchInterest: '',
    experience: '',
    specificTopics: '',
    privacyConsent: false
  })
  
  // UI state
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: checked }))
  }
  
  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Validate form data
    if (!formData.email) {
      setErrorMessage('Email address is required')
      return
    }
    
    if (!formData.privacyConsent) {
      setErrorMessage('You must consent to our privacy policy')
      return
    }
    
    // Clear previous errors
    setErrorMessage('')
    setFormState('submitting')
    
    try {
      // In a real app, you would send data to your backend
      // For demo purposes, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Log the data that would be submitted
      console.log('Subscription data:', formData)
      
      // Show success state
      setFormState('success')
      
      // Reset form after some time
      setTimeout(() => {
        setFormData({
          email: '',
          researchInterest: '',
          experience: '',
          specificTopics: '',
          privacyConsent: false
        })
        setFormState('idle')
      }, 5000)
    } catch (error) {
      console.error('Submission error:', error)
      setFormState('error')
      setErrorMessage('An error occurred. Please try again.')
    }
  }
  
  // Current date and user
  const currentDate = "2025-05-17 18:06:17"
  const currentUser = "linhduongtuan"
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 dark:text-white">Subscribe to Our Research Updates</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Get the latest research findings, tutorials, and exclusive content delivered to your inbox.
        </p>
        
        {formState === 'success' ? (
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-md p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-green-800 dark:text-green-300">Success!</h4>
                <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                  Thank you for subscribing! We'll be sending updates to {formData.email}.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="your.email@example.com"
                required
              />
            </div>
            
            {/* Research interest field */}
            <div>
              <label htmlFor="researchInterest" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Primary Research Interest
              </label>
              <select
                id="researchInterest"
                name="researchInterest"
                value={formData.researchInterest}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select your primary interest</option>
                <option value="machine-learning">Machine Learning</option>
                <option value="deep-learning">Deep Learning</option>
                <option value="computer-vision">Computer Vision</option>
                <option value="nlp">Natural Language Processing</option>
                <option value="reinforcement-learning">Reinforcement Learning</option>
                <option value="data-science">Data Science</option>
                <option value="scientific-computing">Scientific Computing</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            {/* Experience level */}
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Experience Level
              </label>
              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select your experience level</option>
                <option value="beginner">Beginner - Learning the basics</option>
                <option value="intermediate">Intermediate - Some practical experience</option>
                <option value="advanced">Advanced - Working professionally</option>
                <option value="expert">Expert - Leading research/development</option>
              </select>
            </div>
            
            {/* Specific topics */}
            <div>
              <label htmlFor="specificTopics" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Specific Topics or Questions
              </label>
              <textarea
                id="specificTopics"
                name="specificTopics"
                value={formData.specificTopics}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="What specific topics or questions would you like to see covered in our newsletter?"
              ></textarea>
            </div>
            
            {/* Privacy consent */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="privacyConsent"
                  name="privacyConsent"
                  type="checkbox"
                  checked={formData.privacyConsent}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="privacyConsent" className="font-medium text-gray-700 dark:text-gray-300">
                  I consent to receive emails <span className="text-red-500">*</span>
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  We'll respect your privacy and you can unsubscribe at any time.
                </p>
              </div>
            </div>
            
            {/* Error message */}
            {errorMessage && (
              <div className="text-red-500 text-sm">{errorMessage}</div>
            )}
            
            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={formState === 'submitting'}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                  ${formState === 'submitting' ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
              >
                {formState === 'submitting' ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Subscribe Now'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 text-xs text-gray-500 dark:text-gray-400">
        Last updated: {currentDate} by {currentUser}
      </div>
    </div>
  )
}