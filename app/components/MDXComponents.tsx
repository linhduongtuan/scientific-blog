"use client"

import { useState, useRef, ReactNode } from 'react'

// Enhanced CodeBlock component with better copy functionality
const CodeBlock = ({ className, children }: { className?: string, children: ReactNode }) => {
  const [copied, setCopied] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)
  
  // Extract language name from className if it exists
  const language = className?.replace('language-', '') || 'text'
  
  const handleCopy = async () => {
    if (!preRef.current) return
    
    // Get text content from pre element
    const code = preRef.current.textContent || ''
    
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy code: ', err)
    }
  }
  
  return (
    <div className="code-block-wrapper group my-6 relative">
      <pre ref={preRef} className={className}>
        {children}
      </pre>
      
      <button
        type="button"
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 rounded-md bg-gray-700/80 dark:bg-gray-800/80 
                  text-gray-200 hover:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none 
                  focus:ring-2 focus:ring-blue-500 transition-all duration-200 opacity-0 
                  group-hover:opacity-100"
        aria-label="Copy code to clipboard"
      >
        {copied ? (
          <>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                clipRule="evenodd" 
              />
            </svg>
            <span className="sr-only">Copied!</span>
          </>
        ) : (
          <>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" 
              />
            </svg>
            <span className="sr-only">Copy to clipboard</span>
          </>
        )}
      </button>
    </div>
  )
}

const InlineCode = ({ children }: { children: ReactNode }) => {
  return <code className="font-mono">{children}</code>
}

export const MDXComponents = {
  pre: CodeBlock,
  code: InlineCode,
}