import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { compileMDX } from 'next-mdx-remote/rsc'
import { getCachedData } from './cache'

// Define interfaces for type safety
interface BlogPostFrontmatter {
  title: string;
  date: string;
  author: string;
  excerpt: string;
  tags: string[];
  coverImage?: string;
  readingTime?: string;
  [key: string]: any;
}

interface BlogPost extends BlogPostFrontmatter {
  slug: string;
  content: React.ReactNode;
  rawContent: string; // Add raw content for copy functionality
}

interface BlogPostListing extends BlogPostFrontmatter {
  slug: string;
}

const rootDirectory = path.join(process.cwd(), 'app/content')

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return getCachedData(
    `blog-post-${slug}`,
    async () => {
      const filePath = path.join(rootDirectory, 'blog', `${slug}.mdx`)
      
      try {
        const fileContents = fs.readFileSync(filePath, 'utf8')
        const { frontmatter, content, rawContent } = await parseMDX(fileContents)
        
        return {
          slug,
          ...frontmatter,
          content,
          rawContent
        } as BlogPost
      } catch (error) {
        console.error(`Error reading blog post ${slug}:`, error)
        return null
      }
    },
    600 // Cache for 10 minutes
  )
}

export async function getAllBlogPosts(): Promise<BlogPostListing[]> {
  return getCachedData(
    'all-blog-posts',
    async () => {
      const blogDirectory = path.join(rootDirectory, 'blog')
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(blogDirectory)) {
        fs.mkdirSync(blogDirectory, { recursive: true })
        return [] // Return empty array if no posts exist yet
      }
      
      const filenames = fs.readdirSync(blogDirectory)
      
      const posts: BlogPostListing[] = await Promise.all(
        filenames
          .filter(filename => filename.endsWith('.mdx'))
          .map(async filename => {
            const slug = filename.replace(/\.mdx$/, '')
            const filePath = path.join(blogDirectory, filename)
            const fileContents = fs.readFileSync(filePath, 'utf8')
            
            // Extract frontmatter with proper typing
            const { data } = matter(fileContents)
            const frontmatter = data as BlogPostFrontmatter
            
            return {
              slug,
              ...frontmatter
            } as BlogPostListing
          })
      )
      
      // Sort posts by date (newest first) with robust handling
      return posts.sort((a, b) => {
        // Safe date parsing function with proper typing
        const getValidDate = (post: BlogPostListing): number => {
          if (!post.date) return 0;
          const timestamp = new Date(post.date).getTime();
          return isNaN(timestamp) ? 0 : timestamp;
        };
        
        return getValidDate(b) - getValidDate(a);
      })
    },
    300 // Cache for 5 minutes
  )
}

async function parseMDX(source: string): Promise<{ 
  frontmatter: BlogPostFrontmatter, 
  content: React.ReactNode,
  rawContent: string 
}> {
  // Parse frontmatter
  const { data, content: markdownContent } = matter(source)
  const frontmatter = data as BlogPostFrontmatter
  
  // Compile MDX content
  const { content } = await compileMDX({
    source: markdownContent,
    options: { 
      parseFrontmatter: false,
      mdxOptions: {
        development: process.env.NODE_ENV === 'development'
      }
    },
  })
  
  return { frontmatter, content, rawContent: markdownContent }
}