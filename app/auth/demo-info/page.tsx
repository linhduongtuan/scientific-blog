"use client";

import Link from "next/link";

export default function DemoInstructions() {
  return (
    <div className="max-w-3xl mx-auto mt-16 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Demo Authentication Information</h1>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mb-8 text-blue-800 dark:text-blue-200">
        <p>
          This is a demonstration of authentication functionality. In a real application, this would be connected 
          to a secure backend with proper password hashing and JWT tokens.
        </p>
      </div>
      
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Demo Accounts</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Role</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Email</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Password</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Features</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            <tr>
              <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-300">Admin</td>
              <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-300">admin@example.com</td>
              <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-300">password123</td>
              <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-300">
                Admin dashboard, commenting, all content
              </td>
            </tr>
            <tr>
              <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-300">Premium User</td>
              <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-300">premium@example.com</td>
              <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-300">password123</td>
              <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-300">
                Commenting, premium content
              </td>
            </tr>
            <tr>
              <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-300">Regular User</td>
              <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-300">user@example.com</td>
              <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-300">password123</td>
              <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-300">
                Basic content only
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mt-8 flex justify-between">
        <Link href="/auth/signin" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
          Go to Sign In
        </Link>
        <Link href="/auth/signup" className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
          Go to Sign Up
        </Link>
      </div>
      
      <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md text-yellow-800 dark:text-yellow-200">
        <h3 className="font-semibold mb-2">Note:</h3>
        <p>
          This demo uses localStorage to simulate authentication. In a production application, you would use:
        </p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li>Secure HTTP-only cookies</li>
          <li>Server-side authentication with JWT or session tokens</li>
          <li>Password hashing with bcrypt or Argon2</li>
          <li>CSRF protection</li>
          <li>Rate limiting</li>
        </ul>
      </div>
    </div>
  );
}