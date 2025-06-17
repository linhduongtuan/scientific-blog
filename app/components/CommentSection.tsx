"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import RichTextEditor from "./RichTextEditor";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  subscribed: boolean;
  emailVerified: string | null;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
}

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user, status, isSubscribed } = useAuth();

  useEffect(() => {
    async function fetchComments() {
      try {
        // Simulating API call to get comments
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Demo comments
        setComments([
          {
            id: "1",
            content: "This is a great article! Thanks for sharing these insights about scientific computing.",
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            user: {
              id: "1",
              name: "Jane Smith",
              image: ""
            }
          },
          {
            id: "2",
            content: "I've been following your research for a while now. The methodological approach you outlined here is very interesting.",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            user: {
              id: "2",
              name: "John Doe",
              image: ""
            }
          }
        ]);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }
    
    fetchComments();
  }, [postId]);

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    
    if (!comment.trim()) return;
    
    setSubmitting(true);
    setError("");
    
    try {
      // Simulating API call to post comment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new comment
      const newComment: Comment = {
            id: String(Date.now()),
            content: comment,
            createdAt: new Date().toISOString(),
            user: {
              id: user?.id || "anonymous",
              name: user?.name || "Anonymous",
              image: (user as any)?.image || undefined
            }
          };
      
      setComments([newComment, ...comments]);
      setComment("");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  }

  function formatDate(dateString: string) {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  return (
    <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Comments</h2>
      
      {error && (
        <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md">
          {error}
        </div>
      )}
      
      {status === "authenticated" ? (
        isSubscribed ? (
          <form onSubmit={handleSubmitComment} className="mb-8">
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your comment
              </label>
              <RichTextEditor
                content={comment}
                onChange={setComment}
                placeholder="Share your thoughts... You can use formatting!"
                className="min-h-[120px]"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors ${
                submitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? "Submitting..." : "Post Comment"}
            </button>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-md">
            <p className="mb-2 font-medium">Subscribe to comment</p>
            <p className="mb-4 text-sm">
              Only subscribed users can comment on articles. Subscribe to join the conversation.
            </p>
            <Link
              href="/subscription"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Subscribe Now
            </Link>
          </div>
        )
      ) : (
        <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-md">
          <p className="mb-2 font-medium">Sign in to comment</p>
          <p className="mb-4 text-sm">
            You need to sign in to join the conversation.
          </p>
          <Link
            href="/auth/signin"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors mr-2"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Sign Up
          </Link>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center min-h-[100px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium mr-3">
                  {comment.user.name?.charAt(0).toUpperCase() || "A"}
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {comment.user.name || "Anonymous"}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(comment.createdAt)}
                  </div>
                </div>
              </div>
              <div className="text-gray-700 dark:text-gray-300 mt-2 whitespace-pre-wrap">
                {comment.content}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No comments yet. Be the first to share your thoughts!
        </div>
      )}
    </div>
  );
}