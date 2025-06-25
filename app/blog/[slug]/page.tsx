import Link from 'next/link'
import { getBlogPostBySlug, getAllBlogPosts } from '../../lib/mdx'
import CommentSection from '../../components/CommentSection'
import BlogContent from '../../components/BlogContent'
import ReadingProgress from '../../components/ReadingProgress'
import SocialShare from '../../components/SocialShare'
import TableOfContents from '../../components/TableOfContents'
import RelatedPosts from '../../components/RelatedPosts'
import { notFound } from 'next/navigation'

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = await getAllBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// Format date from ISO format to readable format
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug)
  
  if (!post) {
    return notFound()
  }

  // Get all blog posts for related posts section
  const allPosts = await getAllBlogPosts()
  
  // Find related posts (posts with at least one matching tag)
  const relatedPosts = allPosts
    .filter(p => p.slug !== post.slug && 
      (p.tags && p.tags.length > 0) && (post.tags && post.tags.length > 0) && 
      p.tags.some((tag: string) => post.tags.includes(tag)))
    .slice(0, 2) // Limit to 2 related posts

  // Current date and user information
  const currentDate = "2025-05-17 17:35:55"
  const currentUser = "linhduongtuan"

  return (
    <>
      <ReadingProgress />
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-8">
          {/* Table of Contents - Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <TableOfContents content={post.rawContent} />
            </div>
          </aside>

          {/* Main Content */}
          <article className="flex-1 min-w-0 max-w-4xl mx-auto lg:mx-0">
          <div className="mb-8">
            <Link href="/blog" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
              ← Back to Blog
            </Link>
          </div>
      
      {post.coverImage && (
        <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
          <div className="relative w-full h-64 bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold">
              Cover Image for: {post.title}
            </div>
          </div>
        </div>
      )}
      
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4 dark:text-white">{post.title}</h1>
        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-6">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="mx-2">•</span>
          <span>{post.author}</span>
          <span className="mx-2">•</span>
          <span>{post.readingTime}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags && post.tags.map((tag: string) => (
            <Link 
              key={tag} 
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {tag}
            </Link>
          ))}
        </div>
        
        <p className="text-xl text-gray-700 dark:text-gray-300 italic">{post.excerpt}</p>
      </header>
      
      {/* Social Share */}
      <div className="mb-8">
        <SocialShare 
          title={post.title}
          url={`/blog/${post.slug}`}
          excerpt={post.excerpt}
        />
      </div>

      {/* Pass MDX content to client component for rendering */}
      <BlogContent content={post.content} />
      
      {/* Comment Section */}
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <CommentSection postId={post.slug} />
      </div>
      
      {/* Related Posts */}
      <RelatedPosts 
        currentSlug={post.slug}
        currentTags={post.tags || []}
        allPosts={allPosts as any}
      />
      
            {/* Last updated information */}
            <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-right">
              <p>Last updated: {currentDate} by {currentUser}</p>
            </div>
          </article>

          {/* Mobile TOC Toggle */}
          <div className="lg:hidden fixed bottom-4 right-4 z-50">
            <TableOfContents content={post.rawContent} />
          </div>
        </div>
      </div>
    </>
  )
}