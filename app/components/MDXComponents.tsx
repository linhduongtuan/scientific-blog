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

// Enhanced Table components
const Table = ({ children, ...props }: { children: ReactNode, [key: string]: any }) => (
  <div className="overflow-x-auto my-6">
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg" {...props}>
      {children}
    </table>
  </div>
)

const TableHead = ({ children, ...props }: { children: ReactNode, [key: string]: any }) => (
  <thead className="bg-gray-50 dark:bg-gray-800" {...props}>
    {children}
  </thead>
)

const TableBody = ({ children, ...props }: { children: ReactNode, [key: string]: any }) => (
  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700" {...props}>
    {children}
  </tbody>
)

const TableRow = ({ children, ...props }: { children: ReactNode, [key: string]: any }) => (
  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800" {...props}>
    {children}
  </tr>
)

const TableHeader = ({ children, ...props }: { children: ReactNode, [key: string]: any }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" {...props}>
    {children}
  </th>
)

const TableData = ({ children, ...props }: { children: ReactNode, [key: string]: any }) => (
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100" {...props}>
    {children}
  </td>
)

// Enhanced iframe component for YouTube embeds
const IFrame = ({ src, title, width = "100%", height = "400", ...props }: { 
  src: string, 
  title: string, 
  width?: string | number, 
  height?: string | number,
  [key: string]: any 
}) => (
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
)

// Enhanced figure and figcaption components
const Figure = ({ children, ...props }: { children: ReactNode, [key: string]: any }) => (
  <figure className="my-6 text-center" {...props}>
    {children}
  </figure>
)

const FigCaption = ({ children, ...props }: { children: ReactNode, [key: string]: any }) => (
  <figcaption className="mt-2 text-sm text-gray-600 dark:text-gray-400 italic" {...props}>
    {children}
  </figcaption>
)

// Export components object for MDX
export const MDXComponents = {
  pre: CodeBlock,
  code: InlineCode,
  // Table components
  table: Table,
  thead: TableHead,
  tbody: TableBody,
  tr: TableRow,
  th: TableHeader,
  td: TableData,
  // Media components
  iframe: IFrame,
  figure: Figure,
  figcaption: FigCaption,
  // Typography components
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