"use client"

// Simple client component that wraps MDX content
export default function BlogContent({ content }: { content: React.ReactNode }) {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      {content}
    </div>
  )
}