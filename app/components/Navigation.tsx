"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import DarkModeToggle from './DarkModeToggle'
import SubscriptionForm from './SubscriptionForm'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showSubscribeModal, setShowSubscribeModal] = useState(false)
  const pathname = usePathname()
  
  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])
  
  // Current date and time information
  const currentDate = "2025-05-17 20:30:21"
  const currentUser = "linhduongtuan"
  
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Projects', href: '/projects' },
    { name: 'Publications', href: '/publications' },
    { name: 'Contact', href: '/contact' },
  ]
  
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-blue-600 dark:text-blue-400 font-bold text-xl">ScienceBlog</span>
            </Link>
            
            {/* Desktop navigation links */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full
                    ${pathname === link.href
                      ? 'border-blue-500 text-gray-900 dark:text-white'
                      : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Desktop buttons */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <button
              onClick={() => setShowSubscribeModal(true)}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Subscribe
            </button>
            <DarkModeToggle />
          </div>
          
          {/* Mobile buttons and hamburger */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setShowSubscribeModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-3 rounded-md text-sm mr-2"
            >
              Subscribe
            </button>
            <div className="mr-2">
              <DarkModeToggle />
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">{isMenuOpen ? 'Close main menu' : 'Open main menu'}</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, explicitly controlled by state */}
      <div 
        className={`sm:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`} 
        id="mobile-menu"
      >
        <div className="pt-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium
                ${pathname === link.href
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
      
      {/* Subscribe Modal */}
      {showSubscribeModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen p-4 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowSubscribeModal(false)}></div>
            
            <div className="relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                  onClick={() => setShowSubscribeModal(false)}
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <SubscriptionForm />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}