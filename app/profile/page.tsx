"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { user, status } = useAuth();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated" && user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user, status, router]);

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    
    if (!name) {
      setError("Name cannot be empty");
      return;
    }
    
    setLoading(true);
    setError("");
    setUpdateSuccess(false);
    
    try {
      // Simulating profile update for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUpdateSuccess(true);
      // In a real implementation, you would call an API to update the user's profile
    } catch (err: any) {
      setError(err.message || "An error occurred while updating your profile");
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Profile</h1>
      
      {error && (
        <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md">
          {error}
        </div>
      )}
      
      {updateSuccess && (
        <div className="mb-6 p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
          Your profile has been updated successfully.
        </div>
      )}
      
      <form onSubmit={handleUpdateProfile}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white bg-gray-100 dark:bg-gray-600"
            value={email}
            disabled
            readOnly
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Email cannot be changed.
          </p>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center">
            <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-full p-1 flex items-center cursor-pointer">
              <div className={`w-4 h-4 rounded-full transform duration-300 ease-in-out ${user?.subscribed ? 'bg-green-500 translate-x-10' : 'bg-gray-400'}`}></div>
            </div>
            <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
              {user?.subscribed ? 'Subscribed' : 'Not Subscribed'}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {user?.subscribed 
              ? 'You are currently subscribed to our newsletter and have premium access.' 
              : 'Subscribe to get premium access and receive our newsletter.'}
          </p>
          {!user?.subscribed && (
            <button
              type="button"
              onClick={() => router.push('/subscription')}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 text-sm rounded-md transition-colors"
            >
              Subscribe Now
            </button>
          )}
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}