import { ThemeProvider } from 'next-themes'
import { AuthProvider } from '@/contexts/AuthContext'
import { NextAuthProvider } from '@/contexts/NextAuthProvider'
import { NotificationProvider } from './components/NotificationSystem'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import type { Metadata } from 'next'
import './globals.css'
import Navigation from './components/Navigation'

export const metadata: Metadata = {
  title: 'Scientific Blog',
  description: 'A blog about scientific computing, research, and data science',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Scientific Blog',
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
}

export function generateViewport() {
  return {
    themeColor: '#2563eb',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="color-scheme" content="light dark" />
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                // On page load, immediately apply saved theme to prevent flash
                const savedTheme = localStorage.getItem('scientific-blog-theme');
                if (savedTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                } else if (savedTheme === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.style.colorScheme = 'light';
                }
              } catch (e) {
                console.error('Theme initialization error:', e);
              }
            })();
          `
        }} />
      </head>
      <body className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white antialiased">
        <NextAuthProvider>
          <AuthProvider>
            <NotificationProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem={true}
                disableTransitionOnChange={false}
                storageKey="scientific-blog-theme"
                enableColorScheme={true}
                themes={['light', 'dark']}
              >
                <Navigation />
                <main className="px-4 sm:px-6 max-w-7xl mx-auto py-6">
                  {children}
                </main>
                <PWAInstallPrompt />
              </ThemeProvider>
            </NotificationProvider>
          </AuthProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}