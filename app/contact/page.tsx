"use client"

import { useState } from 'react'

// Current time: 2025-05-17 16:27:50
// User: linhduongtuan

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    subject: '',
    message: '',
    interests: [] as string[]
  })
  
  const [submitStatus, setSubmitStatus] = useState<{
    submitted: boolean;
    success: boolean;
    message: string;
  } | null>(null)
  
  const interestOptions = [
    'Research Collaboration',
    'Speaking Engagement',
    'Consulting',
    'PhD/MSc Supervision',
    'Code/Project Question',
    'Other'
  ]
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target
    setFormData(prev => {
      if (checked) {
        return { ...prev, interests: [...prev.interests, value] }
      } else {
        return { ...prev, interests: prev.interests.filter(item => item !== value) }
      }
    })
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // In a real application, you would send this data to your backend
    console.log('Form submitted:', formData)
    
    // Simulate form submission
    setSubmitStatus({
      submitted: true,
      success: true,
      message: 'Thank you for your message! I will get back to you soon.'
    })
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      organization: '',
      subject: '',
      message: '',
      interests: []
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 dark:text-white">Get in Touch</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <div>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            I'm always interested in collaborations, speaking opportunities, or discussing research ideas. 
            Please feel free to reach out using the form or through any of the direct contact methods listed.
          </p>
          
          <div className="space-y-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-1 dark:text-white">Email</h3>
              <p className="text-gray-700 dark:text-gray-300">lduong@kth.se</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-1 dark:text-white">Office Location</h3>
              <p className="text-gray-700 dark:text-gray-300">
                KTH Royal Institute of Technology<br />
                School of Engineering Sciences in Chemistry, Biotechnology and Health<br />
                Stockholm, Sweden
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-1 dark:text-white">Office Hours</h3>
              <p className="text-gray-700 dark:text-gray-300">
                By appointment (virtual meetings available)<br />
                Time zone: Central European Time (CET/CEST)
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-1 dark:text-white">Social Media</h3>
              <div className="flex space-x-4 mt-2">
                <a href="https://github.com/linhduongtuan" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://linkedin.com/in/linhduongtuan" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a href="https://scholar.google.com/citations?user=aZKRy1oAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  <span className="sr-only">Google Scholar</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" />
                  </svg>
                </a>
                <a href="https://orcid.org/0000-0001-7411-1369" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  <span className="sr-only">ORCID</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947 0 .525-.422.947-.947.947-.525 0-.946-.422-.946-.947 0-.525.421-.947.946-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-1.016 5.016-4.72 5.016h-4.525V7.416zm1.444 1.303v7.444h2.297c2.272 0 3.272-1.272 3.272-3.722s-1.297-3.722-3.584-3.722h-1.985z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 dark:text-white">Available For</h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>• Research Collaborations in Medical AI</li>
              <li>• Speaking Engagements & Technical Workshops</li>
              <li>• PhD/MSc Student Supervision (Computational Biology)</li>
              <li>• Medical AI Consulting Projects</li>
              <li>• Peer Review & Technical Assessment</li>
              <li>• Open Source Project Collaboration</li>
            </ul>
          </div>
        </div>
        
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6 dark:text-white">Send a Message</h2>
            
            {submitStatus && submitStatus.submitted ? (
              <div 
                className={`p-4 mb-6 rounded-md ${
                  submitStatus.success ? 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}
              >
                {submitStatus.message}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Organization
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject*
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select a subject</option>
                    <option value="Research Collaboration">Research Collaboration</option>
                    <option value="Speaking Engagement">Speaking Engagement</option>
                    <option value="Student Supervision">Student Supervision</option>
                    <option value="Consulting Opportunity">Consulting Opportunity</option>
                    <option value="Technical Question">Technical Question</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Areas of Interest
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {interestOptions.map(option => (
                      <div key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`interest-${option}`}
                          name="interests"
                          value={option}
                          checked={formData.interests.includes(option)}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor={`interest-${option}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message*
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  ></textarea>
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>* Required fields</p>
                  <p className="mt-1">Your information will only be used to respond to your inquiry and will not be shared with third parties.</p>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  Send Message
                </button>
              </form>
            )}
            
            {/* Last updated notice */}
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-6 text-right">
              Last updated: 2025-05-17 by linhduongtuan
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}