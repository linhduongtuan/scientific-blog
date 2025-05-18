"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  subscribed: boolean;
}

interface AuthContextType {
  user: User | null;
  status: "loading" | "authenticated" | "unauthenticated";
  isAdmin: boolean;
  isSubscribed: boolean;
  signin: (credentials: { email: string; password: string }) => Promise<any>;
  signup: (userData: { name: string; email: string; password: string }) => Promise<any>;
  signout: () => Promise<void>;
}

// Demo users for testing
const DEMO_USERS = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    password: "password123",
    role: "ADMIN" as const,
    subscribed: true
  },
  {
    id: "2",
    name: "Regular User",
    email: "user@example.com",
    password: "password123",
    role: "USER" as const,
    subscribed: false
  },
  {
    id: "3",
    name: "Premium User",
    email: "premium@example.com",
    password: "password123",
    role: "USER" as const,
    subscribed: true
  }
];

// Default values
const defaultAuthContext: AuthContextType = {
  user: null,
  status: "unauthenticated",
  isAdmin: false,
  isSubscribed: false,
  signin: async () => ({ error: "Auth not implemented yet" }),
  signup: async () => ({ error: "Auth not implemented yet" }),
  signout: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const router = useRouter();

  // Check if user is logged in on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('scientificBlogUser');
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAdmin(parsedUser.role === "ADMIN");
          setIsSubscribed(parsedUser.subscribed);
          setStatus("authenticated");
        } catch (error) {
          console.error("Failed to parse stored user data:", error);
          localStorage.removeItem('scientificBlogUser');
          setStatus("unauthenticated");
        }
      } else {
        setStatus("unauthenticated");
      }
    } else {
      setStatus("unauthenticated");
    }
  }, []);

  // Simulated sign in function
  const signin = async ({ email, password }: { email: string; password: string }) => {
    // Find user in our demo users
    const user = DEMO_USERS.find(u => u.email === email);
    
    if (!user) {
      return { error: "User not found" };
    }
    
    if (user.password !== password) {
      return { error: "Invalid password" };
    }
    
    // For demo purposes, we'll exclude the password before storing
    const { password: _, ...userWithoutPassword } = user;
    
    // Store user in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('scientificBlogUser', JSON.stringify(userWithoutPassword));
    }
    
    // Update state
    setUser(userWithoutPassword);
    setIsAdmin(userWithoutPassword.role === "ADMIN");
    setIsSubscribed(userWithoutPassword.subscribed);
    setStatus("authenticated");
    
    return { success: true };
  };

  // Simulated sign up function
  const signup = async ({ name, email, password }: { name: string; email: string; password: string }) => {
    // Check if email is already taken
    if (DEMO_USERS.some(u => u.email === email)) {
      return { error: "Email already in use" };
    }
    
    return { 
      success: true, 
      message: "Registration successful! Please check your email for verification." 
    };
  };

  // Sign out function
  const signout = async () => {
    // Remove user from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('scientificBlogUser');
    }
    
    // Update state
    setUser(null);
    setIsAdmin(false);
    setIsSubscribed(false);
    setStatus("unauthenticated");
    
    // Redirect to home page
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        isAdmin,
        isSubscribed,
        signin,
        signup,
        signout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);