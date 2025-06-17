"use client"

import { useState, useRef, ReactNode } from 'react'

// Enhanced CodeBlock component with syntax highlighting and better styling
const CodeBlock = ({ className, children, ...props }: { 
  className?: string, 
  children: ReactNode,
  [key: string]: any 
}) => {
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
    <div className="enhanced-code-block group my-6 relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
      {/* Language label */}
      {language !== 'text' && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            {language}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 
                      hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 
                      focus:ring-blue-500 transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Copy code to clipboard"
          >
            {copied ? (
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
      )}
      
      {/* Code content */}
      <div className="relative">
        <pre 
          ref={preRef} 
          className={`${className} p-4 overflow-auto text-sm leading-relaxed bg-transparent`}
          {...props}
        >
          {children}
        </pre>
        
        {/* Copy button for blocks without language header */}
        {language === 'text' && (
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
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

const InlineCode = ({ children }: { children: ReactNode }) => {
  return <code className="font-mono">{children}</code>
}

// Export components object for MDX
export const MDXComponents = {
  pre: CodeBlock,
  code: InlineCode,
  // Add other common components
  h1: (props: any) => <h1 className="text-3xl font-bold mb-4" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-semibold mb-3" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-medium mb-2" {...props} />,
  p: (props: any) => <p className="mb-4" {...props} />,
  a: (props: any) => <a className="text-blue-600 hover:text-blue-800 underline" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside mb-4" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-inside mb-4" {...props} />,
  li: (props: any) => <li className="mb-1" {...props} />,
  blockquote: (props: any) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />,
}