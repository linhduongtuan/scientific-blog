// import { Inter } from 'next/font/google'
// import './globals.css'
// import type { Metadata } from 'next'
// import { ThemeProvider } from './providers/theme-provider'
// // import { ThemeProvider } from 'next-themes'
// import { ThemeToggle } from './components/theme-toggle'

// const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'Linh Duong | Scientific Researcher & Developer',
//   description: 'Personal website and blog of Linh Duong, scientific researcher and developer specializing in machine learning and data science.',
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body className={inter.className}>
//         <ThemeProvider>
//           <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
//             <header>
//               <nav className="bg-white dark:bg-gray-800 shadow-md">
//                 <div className="container mx-auto px-4">
//                   <div className="flex justify-between items-center py-4">
//                     <div className="flex items-center">
//                       <a href="/" className="text-xl font-bold text-gray-800 dark:text-white">
//                         Linh Duong
//                       </a>
//                     </div>

//                     {/* Desktop Navigation */}
//                     <div className="hidden md:flex space-x-8">
//                       <a href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200">Home</a>
//                       <a href="/blog" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200">Blog</a>
//                       <a href="/projects" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200">Projects</a>
//                       <a href="/publications" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200">Publications</a>
//                       <a href="/about" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200">About</a>
//                       <a href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200">Contact</a>
//                     </div>
                    
//                     {/* Theme Toggle */}
//                     <div className="flex items-center">
//                       <ThemeToggle />
//                     </div>
//                   </div>
//                 </div>
//               </nav>
//             </header>
//             <main className="flex-grow container mx-auto px-4 py-8">
//               {children}
//             </main>
//             <footer className="bg-gray-800 dark:bg-gray-950 text-white py-8">
//               <div className="container mx-auto px-4">
//                 <div className="flex flex-col md:flex-row justify-between items-center">
//                   <div className="mb-4 md:mb-0">
//                     <h3 className="text-xl font-bold">Linh Duong</h3>
//                     <p className="text-gray-300 mt-2">Scientific Researcher & Developer</p>
//                   </div>
//                   <div className="flex space-x-4">
//                     <a href="https://github.com/linhduongtuan" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">GitHub</a>
//                     <a href="https://linkedin.com/in/linhduongtuan" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">LinkedIn</a>
//                     <a href="mailto:your-email@example.com" className="text-gray-300 hover:text-white">Email</a>
//                   </div>
//                 </div>
//                 <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
//                   <p>© {new Date().getFullYear()} Linh Duong. All rights reserved.</p>
//                 </div>
//               </div>
//             </footer>
//           </div>
//         </ThemeProvider>
//       </body>
//     </html>
//   )
// }


import { ThemeProvider } from 'next-themes'
import type { Metadata } from 'next'
import './globals.css'
import Navigation from './components/Navigation'

export const metadata: Metadata = {
  title: 'Scientific Blog',
  description: 'A blog about scientific computing, research, and data science',
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
      </head>
      <body className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange={false}
          storageKey="scientific-blog-theme"
          enableColorScheme={true}
        >
          <Navigation />
          <main className="px-4 sm:px-6 max-w-7xl mx-auto py-6">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}