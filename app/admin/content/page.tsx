"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import RichTextEditor from "@/app/components/RichTextEditor";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  tags: string[];
  status: 'draft' | 'published';
  readingTime: string;
}

export default function ContentManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { user, isAdmin, status } = useAuth();
  const { addNotification } = useNotifications();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    tags: '',
    status: 'draft' as 'draft' | 'published'
  });


  // Move fetchPosts above useEffect and wrap in useCallback to fix missing dependency warning
  const fetchPosts = async () => {
    try {
      setLoading(true);
      // Simulate API call - in real app, this would fetch from your CMS/database
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockPosts: BlogPost[] = [
        {
          id: '1',
          title: 'Getting Started with Scientific Computing',
          slug: 'getting-started',
          excerpt: 'Learn the fundamentals of scientific computing with Python.',
          content: '# Getting Started\n\nThis is the content...',
          author: 'Admin User',
          date: '2024-01-15',
          tags: ['python', 'scientific-computing', 'tutorial'],
          status: 'published',
          readingTime: '5 min read'
        },
        {
          id: '2',
          title: 'Understanding Transformers',
          slug: 'understanding-transformers',
          excerpt: 'Deep dive into transformer architecture and applications.',
          content: '# Transformers\n\nTransformers have revolutionized...',
          author: 'Admin User',
          date: '2024-01-10',
          tags: ['ai', 'transformers', 'deep-learning'],
          status: 'published',
          readingTime: '8 min read'
        },
        {
          id: '3',
          title: 'Draft Article',
          slug: 'draft-article',
          excerpt: 'This is a draft article.',
          content: '# Draft\n\nWork in progress...',
          author: 'Admin User',
          date: '2024-01-20',
          tags: ['draft'],
          status: 'draft',
          readingTime: '3 min read'
        }
      ];
      setPosts(mockPosts);
    } catch {
      addNotification({
        type: 'error',
        message: 'Error: Failed to fetch posts'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated" && !isAdmin) {
      router.push("/");
      return;
    }

    fetchPosts();
  }, [isAdmin, router, status, fetchPosts]);

  // fetchPosts moved above

  const handleCreateNew = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      tags: '',
      status: 'draft'
    });
    setSelectedPost(null);
    setIsCreating(true);
    setIsEditing(false);
  };

  const handleEdit = (post: BlogPost) => {
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      tags: post.tags.join(', '),
      status: post.status
    });
    setSelectedPost(post);
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      addNotification({
        type: 'error',
        message: 'Validation Error: Title and content are required'
      });
      return;
    }

    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const slug = formData.slug || formData.title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      const postData: BlogPost = {
        id: selectedPost?.id || Date.now().toString(),
        title: formData.title,
        slug,
        excerpt: formData.excerpt,
        content: formData.content,
        author: user?.name || 'Admin',
        date: selectedPost?.date || new Date().toISOString().split('T')[0],
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        status: formData.status,
        readingTime: `${Math.ceil(formData.content.split(' ').length / 200)} min read`
      };

      if (selectedPost) {
        setPosts(posts.map(p => p.id === selectedPost.id ? postData : p));
        addNotification({
          type: 'success',
          message: 'Post Updated: The blog post has been updated successfully'
        });
      } else {
        setPosts([postData, ...posts]);
        addNotification({
          type: 'success',
          message: 'Post Created: New blog post has been created successfully'
        });
      }

      setIsEditing(false);
      setIsCreating(false);
      setSelectedPost(null);
    } catch {
      addNotification({
        type: 'error',
        message: 'Save Failed: Failed to save the post. Please try again.'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setPosts(posts.filter(p => p.id !== postId));
      addNotification({
        type: 'success',
        message: 'Post Deleted: The blog post has been deleted successfully'
      });
    } catch {
      addNotification({
        type: 'error',
        message: 'Delete Failed: Failed to delete the post'
      });
    }
  };

  const handlePublishToggle = async (post: BlogPost) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newStatus = post.status === 'published' ? 'draft' : 'published';
      setPosts(posts.map(p => 
        p.id === post.id ? { ...p, status: newStatus } : p
      ));
      addNotification({
        type: 'success',
        message: `Post ${newStatus === 'published' ? 'Published' : 'Unpublished'}: The post has been ${newStatus === 'published' ? 'published' : 'moved to draft'}`
      });
    } catch {
      addNotification({
        type: 'error',
        message: 'Update Failed: Failed to update post status'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold dark:text-white">Content Management</h1>
        <button
          onClick={handleCreateNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Create New Post
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Posts List */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold dark:text-white">All Posts ({posts.length})</h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    selectedPost?.id === post.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={() => handleEdit(post)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium dark:text-white truncate">{post.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{post.date}</p>
                      <div className="flex items-center mt-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          post.status === 'published' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {post.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-1 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePublishToggle(post);
                        }}
                        className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                        title={post.status === 'published' ? 'Unpublish' : 'Publish'}
                      >
                        {post.status === 'published' ? '👁️' : '📝'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(post.id);
                        }}
                        className="text-gray-400 hover:text-red-600"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="lg:col-span-2">
          {(isEditing || isCreating) ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold dark:text-white">
                  {isCreating ? 'Create New Post' : 'Edit Post'}
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter post title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="post-slug (auto-generated if empty)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Brief description of the post"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="python, ai, tutorial"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content (Markdown)
                  </label>
                  <RichTextEditor
                    content={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setIsCreating(false);
                      setSelectedPost(null);
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md font-medium transition-colors"
                  >
                    {saving ? 'Saving...' : (isCreating ? 'Create Post' : 'Update Post')}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Select a post to edit
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Choose a post from the list or create a new one to get started.
              </p>
              <button
                onClick={handleCreateNew}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Create New Post
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}