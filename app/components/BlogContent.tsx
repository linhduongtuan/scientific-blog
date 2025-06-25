"use client"

import ReactMarkdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter'
import atomOneDark from 'react-syntax-highlighter/dist/styles/atom-one-dark'
import atomOneLight from 'react-syntax-highlighter/dist/styles/atom-one-light'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

// Enhanced code block component with copy functionality
const CodeBlock = ({ 
  inline, 
  className, 
  children, 
  ...props 
}: {
  inline?: boolean
  className?: string
  children: React.ReactNode
  [key: string]: any
}) => {
  const { theme } = useTheme()
  const [copied, setCopied] = useState(false)
  
  const match = /language-(\w+)/.exec(className || '')
  const language = match ? match[1] : ''
  
  const handleCopy = async () => {
    const code = String(children).replace(/\n$/, '')
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  if (inline) {
    return (
      <code className="bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 px-1 py-0.5 rounded text-sm font-mono" {...props}>
        {children}
      </code>
    )
  }

  return (
    <div className="enhanced-code-block group my-6 relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
      {/* Language label and copy button */}
      {language && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            {language}
          </span>
          <button
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
        <SyntaxHighlighter
          style={theme === 'dark' ? atomOneDark : atomOneLight}
          language={language}
          PreTag="div"
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
            fontSize: '0.875rem',
            lineHeight: '1.6'
          }}
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
        
        {/* Copy button for blocks without language header */}
        {!language && (
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 p-2 rounded-md bg-gray-700/80 dark:bg-gray-800/80 
                      text-gray-200 hover:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none 
                      focus:ring-2 focus:ring-blue-500 transition-all duration-200 opacity-0 
                      group-hover:opacity-100"
            {copied ? (
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            )}
          </button>
        )}
      </div>
    </div>
  )
}

// Enhanced BlogContent component with proper markdown rendering
export default function BlogContent({ content }: { content: string }) {
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <ReactMarkdown
        components={{
          code: CodeBlock,
          h1: ({ children }) => <h1 className="text-3xl font-bold mb-6 mt-8">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-semibold mb-4 mt-6">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-medium mb-3 mt-5">{children}</h3>,
          p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
          a: ({ href, children }) => (
            <a href={href} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline">
              {children}
            </a>
          ),
          ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
          li: ({ children }) => <li className="mb-1">{children}</li>,
          blockquote: ({ children }) => (
          ),
          // Scientific components
          Math: ({ children }) => <MathRenderer>{children}</MathRenderer>,
          Chart: ({ data, ...props }) => <DataVisualization data={data} {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}