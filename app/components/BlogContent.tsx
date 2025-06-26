"use client"

import ReactMarkdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter'
import atomOneDark from 'react-syntax-highlighter/dist/styles/atom-one-dark'
import atomOneLight from 'react-syntax-highlighter/dist/styles/atom-one-light'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import 'katex/dist/katex.min.css'
import type { CodeBlockProps, BlogContentProps } from '@/types/components'

// Math component for inline and display math
function MathComponent({ value, displayMode = false }: { value: string; displayMode?: boolean }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <span className={`${displayMode ? 'block my-4' : 'inline'} bg-gray-100 dark:bg-gray-800 rounded px-2 py-1 animate-pulse`}>
        Loading math...
      </span>
    )
  }

  return (
    <span 
      className={`${displayMode ? 'block my-6 text-center' : 'inline'} math-expression`}
      style={{ 
        fontSize: displayMode ? '1.1em' : '1em',
        lineHeight: displayMode ? '1.5' : 'inherit'
      }}
    >
      {displayMode ? `$$${value}$$` : `$${value}$`}
    </span>
  )
}

// Enhanced CodeBlock component with copy functionality
function CodeBlock({ inline, className, children, ...props }: CodeBlockProps) {
  const { theme } = useTheme()
  const [copied, setCopied] = useState(false)
  
  const language = className?.replace('language-', '') || ''
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(String(children))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
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

// Enhanced BlogContent component with proper markdown rendering
export default function BlogContent({ content }: BlogContentProps) {
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
        remarkPlugins={[
          remarkMath,
          remarkGfm
        ]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        components={{
          code: CodeBlock,
          // Math rendering - these are the correct property names from rehype-katex
          span: ({ className, children, ...props }: any) => {
            if (className === 'math math-display') {
              return <div className="my-6 text-center overflow-x-auto">{children}</div>
            }
            if (className === 'math math-inline') {
              return <span className="inline-block">{children}</span>
            }
            return <span className={className} {...props}>{children}</span>
          },
          div: ({ className, children, ...props }: any) => {
            if (className === 'math math-display') {
              return <div className="my-6 text-center overflow-x-auto" {...props}>{children}</div>
            }
            return <div className={className} {...props}>{children}</div>
          },
          // HTML Elements
          iframe: ({ src, title, width = "100%", height = "400", ...props }: any) => (
            <div className="my-6">
              <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800" style={{ paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src={src}
                  title={title}
                  width={width}
                  height={height}
                  className="absolute top-0 left-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  {...props}
                />
              </div>
            </div>
          ),
          // Image component
          img: ({ src, alt, title, ...props }: any) => (
            <div className="my-6 text-center">
              <img
                src={src}
                alt={alt || ''}
                title={title}
                className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
                style={{ maxHeight: '500px' }}
                {...props}
              />
              {title && (
                <p className="text-sm text-gray-600 dark:text-gray-400 italic mt-2">
                  {title}
                </p>
              )}
            </div>
          ),
          // Table components
          table: ({ children, ...props }: any) => (
            <div className="overflow-x-auto my-6">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg" {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }: any) => (
            <thead className="bg-gray-50 dark:bg-gray-800" {...props}>
              {children}
            </thead>
          ),
          tbody: ({ children, ...props }: any) => (
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700" {...props}>
              {children}
            </tbody>
          ),
          tr: ({ children, ...props }: any) => (
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-800" {...props}>
              {children}
            </tr>
          ),
          th: ({ children, ...props }: any) => (
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }: any) => (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100" {...props}>
              {children}
            </td>
          ),
          // Figure components
          figure: ({ children, ...props }: any) => (
            <figure className="my-6 text-center" {...props}>
              {children}
            </figure>
          ),
          figcaption: ({ children, ...props }: any) => (
            <figcaption className="mt-2 text-sm text-gray-600 dark:text-gray-400 italic" {...props}>
              {children}
            </figcaption>
          ),
          // Typography components
          h1: ({ children }) => <h1 className="text-3xl font-bold mb-6 mt-8">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-semibold mb-4 mt-6">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-medium mb-3 mt-5">{children}</h3>,
          p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
          em: ({ children }) => {
            // Check if this is a figure caption
            const childrenString = String(children);
            if (childrenString.startsWith('Figure ')) {
              return <p className="text-center text-sm text-gray-600 dark:text-gray-400 italic mt-2 mb-6">{children}</p>
            }
            return <em>{children}</em>
          },
          a: ({ href, children }) => (
            <a href={href} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline">
              {children}
            </a>
          ),
          ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
          li: ({ children }) => <li className="mb-1">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic my-6 bg-gray-50 dark:bg-gray-800 py-2">
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}