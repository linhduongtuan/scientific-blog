'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';

// Define the extended user type to match what we set in auth.d.ts
interface ExtendedUser {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  role: string;
  subscribed?: boolean;
}

export function useAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  // Cast the user to our extended type
  const user = session?.user as ExtendedUser | undefined;
  
  // Now TypeScript knows about these properties
  const isAdmin = user?.role === 'ADMIN';
  const isModerator = user?.role === 'MODERATOR' || isAdmin;
  const isSubscribed = user?.subscribed === true;

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password
        });
        
        if (result?.error) {
          setError(result.error);
          return false;
        }
        
        router.refresh();
        return true;
      } catch (err) {
        setError('An unexpected error occurred');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const loginWithProvider = useCallback(
    async (provider: 'google' | 'github') => {
      try {
        setLoading(true);
        setError(null);
        await signIn(provider, { callbackUrl: '/' });
        return true;
      } catch (err) {
        setError('Failed to sign in with provider');
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await signOut({ redirect: false });
      router.push('/');
      router.refresh();
    } catch (err) {
      setError('Failed to sign out');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, password })
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          setError(data.error || 'Failed to register');
          return false;
        }
        
        // Auto login after successful registration
        return await login(email, password);
      } catch (err) {
        setError('An unexpected error occurred');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [login]
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin,
    isModerator,
    isSubscribed,
    login,
    loginWithProvider,
    logout,
    register,
    loading,
    error
  };
}
