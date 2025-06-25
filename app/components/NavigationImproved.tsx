"use client"

import React, { memo, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useApi } from '@/app/hooks/useApi'
import type { UserProfile } from '@/types/components'

interface NavigationProps {
  className?: string
}

interface NavLink {
  name: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
}

// Memoized nav link component to prevent unnecessary re-renders
const NavLinkItem = memo(({ link, isActive }: { link: NavLink; isActive: boolean }) => (
  <Link
    href={link.href}
    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full transition-colors duration-200 ${
      isActive
        ? 'border-blue-500 text-gray-900 dark:text-white'
        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
    }`}
  >
    {link.icon && <link.icon className="w-4 h-4 mr-2" />}
    {link.name}
  </Link>
))

NavLinkItem.displayName = 'NavLinkItem'

// Main navigation component with proper optimization
const NavigationImproved = memo(({ className = '' }: NavigationProps) => {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  
  // Use our improved API hook
  const { data: user, loading: userLoading } = useApi<UserProfile>('/api/user/profile', {
    immediate: true,
    onError: (error) => console.error('Failed to load user profile:', error)
  })

  // Memoize navigation links to prevent recreation on every render
  const navLinks = useMemo<NavLink[]>(() => [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Projects', href: '/projects' },
    { name: 'Publications', href: '/publications' },
    ...(user?.role === 'ADMIN' ? [{ name: 'Dashboard', href: '/dashboard' }] : []),
    { name: 'Contact', href: '/contact' },
  ], [user?.role])

  // Memoized theme toggle handler
  const handleThemeToggle = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  // Memoized user menu items based on authentication state
  const userMenuItems = useMemo(() => {
    if (!user) {
      return [
        { name: 'Sign In', href: '/auth/signin' },
        { name: 'Sign Up', href: '/auth/signup' }
      ]
    }
    
    return [
      { name: 'Profile', href: '/profile' },
      { name: 'Settings', href: '/settings' },
      ...(user.role === 'ADMIN' ? [{ name: 'Admin', href: '/admin' }] : []),
    ]
  }, [user])

  return (
    <nav className={`bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-blue-600 dark:text-blue-400 font-bold text-xl">
                ScienceBlog
              </span>
            </Link>
            
            {/* Desktop navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <NavLinkItem
                  key={link.href}
                  link={link}
                  isActive={pathname === link.href}
                />
              ))}
            </div>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <button
              onClick={handleThemeToggle}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {/* User menu */}
            {userLoading ? (
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            ) : (
              <div className="flex items-center space-x-2">
                {userMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
})

NavigationImproved.displayName = 'NavigationImproved'

export default NavigationImproved
