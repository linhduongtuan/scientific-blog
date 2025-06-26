import { ThemeProvider } from 'next-themes'
import { AuthProvider } from '@/contexts/AuthContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { ChatProvider } from '@/contexts/ChatContext'
import type { Metadata } from 'next'
import './globals.css'
import Navigation from './components/Navigation'
import ChatToggle from './components/ChatToggle'

export const metadata: Metadata = {
  title: 'Scientific Blog - Linh Duong Tuan',
  description: 'A blog about scientific computing, research, and data science by Linh Duong Tuan',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '16x16', type: 'image/x-icon' },
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/favicon.ico' }
    ]
  },
  manifest: '/manifest.json',
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
        <AuthProvider>
          <NotificationProvider>
            <ChatProvider>
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
                <ChatToggle />
              </ThemeProvider>
            </ChatProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
