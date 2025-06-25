"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";

export default function SubscriptionForm({ onSuccessAction }: { onSuccessAction?: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [researchInterests, setResearchInterests] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user, status } = useAuth();
  const { addNotification } = useNotifications();

  // Pre-fill with user data if logged in
  useEffect(() => {
    if (status === "authenticated" && user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user, status]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!name || !email) {
      setError("Please fill in all required fields");
      addNotification({
        type: 'error',
        message: "Please fill in all required fields"
      });
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    setSuccess("");
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          researchInterests: researchInterests.split(',').map(s => s.trim()).filter(Boolean),
          subscriptionType: 'free'
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(result.message || "Successfully subscribed! Check your email for confirmation.");
        addNotification({
          type: 'success',
          message: result.message || "Successfully subscribed! Check your email for confirmation."
        });
        
        // Clear form if not logged in
        if (status !== "authenticated") {
          setName("");
          setEmail("");
        }
        setResearchInterests("");
        
        if (onSuccessAction) {
          onSuccessAction();
        }
      } else {
        setError(result.error || "Failed to subscribe. Please try again.");
        addNotification({
          type: 'error',
          message: result.error || "Failed to subscribe. Please try again."
        });
      }
    } catch (err: any) {
      console.error('Subscription error:', err);
      const errorMessage = "Network error. Please check your connection and try again.";
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Subscribe to our Newsletter</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name *
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={status === "authenticated"}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === "authenticated"}
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="interests" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Research Interests
          </label>
          <textarea
            id="interests"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            value={researchInterests}
            onChange={(e) => setResearchInterests(e.target.value)}
            placeholder="E.g., AI, Machine Learning, Quantum Computing..."
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
    </div>
  );
}