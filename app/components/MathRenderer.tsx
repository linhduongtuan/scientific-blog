"use client"

import { useEffect, useRef } from 'react'

interface MathRendererProps {
  children: string
  display?: boolean
}

export default function MathRenderer({ children, display = false }: MathRendererProps) {
  const mathRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && mathRef.current) {
      // Dynamically load KaTeX or MathJax for math rendering
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js'
      script.onload = () => {
        // @ts-ignore
        if (window.katex) {
          try {
            // @ts-ignore
            window.katex.render(children, mathRef.current, {
              displayMode: display,
              throwOnError: false,
              trust: true
            })
          } catch (error) {
            console.error('Math rendering error:', error)
            if (mathRef.current) {
              mathRef.current.textContent = children
            }
          }
        }
      }
      
      // Load CSS if not already loaded
      if (!document.querySelector('link[href*="katex"]')) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css'
        document.head.appendChild(link)
      }
      
      document.head.appendChild(script)
    }
  }, [children, display])

  return (
    <div 
      ref={mathRef}
      className={`${display ? 'block text-center my-4' : 'inline'} math-expression`}
    >
      {children}
    </div>
  )
}
