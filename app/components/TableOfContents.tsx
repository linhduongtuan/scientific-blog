"use client"

import { useState, useEffect } from 'react'

interface TocItem {
  id: string
  title: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [toc, setToc] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Extract headings from content - handle leading whitespace
    const headingRegex = /^\s*(#{1,6})\s+(.+)$/gm
    const headings: TocItem[] = []
    let match

    console.log('Extracting headings from content:', content.substring(0, 300))

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const title = match[2].trim()
      const id = title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

      console.log('Found heading:', { level, title, id })
      headings.push({ id, title, level })
    }

    console.log('Final TOC:', headings)
    setToc(headings)
  }, [content])

  useEffect(() => {
    // Add IDs to headings in the DOM
    const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    headingElements.forEach((heading, index) => {
      if (toc[index]) {
        heading.id = toc[index].id
      }
    })

    // Intersection Observer for active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0% -35% 0%' }
    )

    headingElements.forEach((heading) => {
      if (heading.id) {
        observer.observe(heading)
      }
    })

    return () => observer.disconnect()
  }, [toc])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Debug: Always show the TOC container for testing
  console.log('TOC Debug:', { tocLength: toc.length, toc, contentType: typeof content })
  
  if (toc.length === 0) return null

  return (
    <>
      {/* Desktop Sidebar Version */}
      <div className="hidden lg:block">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <TocIcon />
            <span className="ml-2">Contents ({toc.length})</span>
          </h3>
          {toc.length > 0 ? (
            <nav className="space-y-1">
              {toc.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToHeading(item.id);
                }}
                className={`
                  block py-2 px-3 text-sm rounded-md transition-colors
                  ${item.level === 1 ? 'font-medium' : ''}
                  ${item.level === 2 ? 'ml-4' : ''}
                  ${item.level === 3 ? 'ml-8' : ''}
                  ${item.level >= 4 ? 'ml-12' : ''}
                  ${activeId === item.id 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                {item.title}
                </a>
              ))}
            </nav>
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>No headings found.</p>
              <p className="mt-2 text-xs">Content type: {typeof content}</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
        aria-label="Toggle Table of Contents"
      >
        <TocIcon />
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile TOC Modal */}
      {isOpen && (
        <div className="lg:hidden fixed bottom-20 right-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-h-96 overflow-y-auto w-80">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Table of Contents
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <nav className="space-y-1">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToHeading(item.id)
                    setIsOpen(false) // Close mobile menu after clicking
                  }}
                  className={`
                    block py-2 px-3 text-sm rounded-md transition-colors
                    ${item.level === 1 ? 'font-medium' : ''}
                    ${item.level === 2 ? 'ml-4' : ''}
                    ${item.level === 3 ? 'ml-8' : ''}
                    ${item.level >= 4 ? 'ml-12' : ''}
                    ${activeId === item.id 
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

function TocIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}