"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { user, status } = useAuth();

  async function handleSubscribe() {
    if (status !== "authenticated") {
      router.push("/auth/signin");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      // In a real app, this would call an API to process payment and update subscription
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (user) {
        // Update user in localStorage
        const updatedUser = { ...user, subscribed: true };
        localStorage.setItem('scientificBlogUser', JSON.stringify(updatedUser));
        
        // Show success message before redirecting
        alert("Subscription successful! Thank you for subscribing.");
        
        // Force reload to update auth context
        window.location.href = "/profile";
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto my-16">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Premium Subscription</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md">
          {error}
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">ScienceBlog Premium</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Unlock all premium features and content</p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">$9.99</span>
              <span className="text-gray-500 dark:text-gray-400">/month</span>
            </div>
          </div>
          
          <hr className="my-8 border-gray-200 dark:border-gray-700" />
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Premium Benefits</h3>
          
          <ul className="space-y-4">
            <li className="flex items-start">
              <svg className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Comment on Articles</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Engage with researchers and discuss scientific topics</p>
              </div>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Premium Content Access</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Read exclusive in-depth articles and research summaries</p>
              </div>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Monthly Research Digest</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Receive curated summaries of breakthrough research</p>
              </div>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Early Access to Papers</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Get access to papers and articles before they're publicly available</p>
              </div>
            </li>
          </ul>
          
          <div className="mt-8">
            <button
              onClick={handleSubscribe}
              disabled={loading || (status === "authenticated" && user?.subscribed)}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              } ${status === "authenticated" && user?.subscribed ? "bg-green-600 hover:bg-green-600 cursor-not-allowed" : ""}`}
            >
              {loading ? "Processing..." : status === "authenticated" && user?.subscribed ? "Already Subscribed" : "Subscribe Now"}
            </button>
            
            {status === "authenticated" && user?.subscribed && (
              <p className="text-center mt-4 text-green-600 dark:text-green-400">
                You are already a premium subscriber. Enjoy all the benefits!
              </p>
            )}
            
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
              Cancel anytime. No long-term commitment required.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mt-8 text-sm text-blue-800 dark:text-blue-200">
        <p className="font-semibold">Demo Mode Note:</p>
        <p>
          This is a demonstration of the subscription flow. In a production application, this would be connected 
          to a payment processor like Stripe. For this demo, clicking "Subscribe Now" will immediately grant you 
          premium access without any actual payment.
        </p>
      </div>
    </div>
  );
}