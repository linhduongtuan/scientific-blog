import Link from 'next/link'
import { getAllBlogPosts } from '../lib/mdx'
import SubscriptionForm from '../components/SubscriptionForm'

// Format date from ISO format to readable format
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

export default async function Blog() {
  // Current date and user information
  const currentDate = "2025-05-17 18:06:17"
  const currentUser = "linhduongtuan"
  
  // Get all blog posts from MDX files
  const posts = await getAllBlogPosts()
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 dark:text-white">Blog</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Thoughts, tutorials, and insights on machine learning, scientific computing, and research.
          <span className="text-sm text-gray-500 dark:text-gray-400 block mt-2">
            Last updated: {currentDate.split(' ')[0]} by {currentUser}
          </span>
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Blog Posts - Takes up 2/3 of width on desktop */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">Latest Articles</h2>
          
          <div className="space-y-8">
            {posts.length > 0 ? (
              posts.map((post) => (
                <article key={post.slug} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                      <span>•</span>
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{post.readingTime}</span>
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-3 dark:text-white">
                      <Link href={`/blog/${post.slug}`} className="text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{post.excerpt}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags && post.tags.map((tag: string) => (
                        <span 
                          key={tag} 
                          className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link href={`/blog/${post.slug}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                      Read More →
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">No blog posts found.</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Make sure you've created MDX files in the <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">app/content/blog</code> directory.
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar - Takes up 1/3 of width on desktop */}
        <div className="md:col-span-1">
          {/* Enhanced Subscription Form */}
          <div className="sticky top-8">
            <SubscriptionForm />
            
            {/* Popular tags */}
            <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-4 dark:text-white">Popular Topics</h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(posts.flatMap(post => post.tags || []))).slice(0, 10).map((tag: string) => (
                  <Link 
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-300 px-3 py-1 rounded-full text-sm transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}