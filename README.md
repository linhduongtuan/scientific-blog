# Scientific Blog Platform

A modern, feature-rich blog platform built with Next.js 14, featuring advanced content management, user authentication, PWA capabilities, and a comprehensive set of interactive features for scientific content publishing.

## ✨ Features

### 🎯 Core Features
- **Modern Stack**: Built with Next.js 14, TypeScript, and Tailwind CSS
- **Authentication**: Secure user authentication with NextAuth.js
- **Content Management**: MDX-based blog posts with rich formatting
- **Responsive Design**: Mobile-first design that works on all devices
- **Dark Mode**: Built-in dark/light theme switching with system preference detection

### 📖 Enhanced Reading Experience
- **📊 Reading Progress Indicator**: Visual progress bar showing reading completion
- **📑 Table of Contents**: Sticky sidebar with auto-generated navigation (desktop) and floating button (mobile)
- **🔗 Social Sharing**: Share posts on Twitter, LinkedIn, Facebook with native mobile sharing support
- **📚 Smart Related Posts**: AI-powered suggestions based on tags, author, and publication date
- **💬 Interactive Comments**: Threaded comment system with real-time updates

### 🛠 Advanced Admin Features
- **📈 Enhanced Admin Dashboard**: Tabbed interface with statistics, user management, and quick actions
- **✏️ Advanced Content Editor**: Full CRUD content management with rich text editing
- **👥 User Management**: Role-based access control with subscription management
- **📊 Analytics Dashboard**: User statistics and content performance metrics

### 🔔 Real-time Features
- **🔔 Notification System**: Toast notifications with persistent notification center
- **⚡ Real-time Updates**: Live notifications for user actions and system events
- **📱 PWA Capabilities**: Offline support, install prompts, and native app-like experience

### 🚀 Performance & PWA
- **📱 Progressive Web App**: Full PWA support with offline caching
- **🔄 Service Worker**: Background sync and push notifications
- **📦 Install Prompt**: Smart install prompts for supported browsers
- **🌐 Offline Support**: Cached content available without internet connection

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom components
- **Database**: Prisma with SQLite (easily configurable for other databases)
- **Authentication**: NextAuth.js with role-based access
- **Content**: MDX with syntax highlighting and rich components
- **PWA**: Service Worker with offline caching
- **Notifications**: Custom toast system with persistence
- **Deployment**: Vercel-ready with optimized builds

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/linhduongtuan/scientific-blog.git
   cd scientific-blog
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npm run setup
   ```

4. **Generate PWA icons** (optional)
   ```bash
   npm run generate-icons
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Email (optional)
EMAIL_SERVER_HOST="smtp.example.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@example.com"
EMAIL_SERVER_PASSWORD="your-password"
EMAIL_FROM="noreply@example.com"

# PWA Configuration (optional)
PWA_NAME="Scientific Blog"
PWA_SHORT_NAME="SciBlog"
PWA_DESCRIPTION="A blog about scientific computing, research, and data science"
```   

## 📁 Project Structure

```
scientific-blog/
├── app/                    # Next.js 14 app directory
│   ├── admin/             # Admin dashboard and content management
│   │   ├── dashboard/     # Main admin dashboard
│   │   └── content/       # Advanced content editor
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── blog/              # Blog pages and components
│   ├── components/        # Reusable components
│   │   ├── ReadingProgress.tsx
│   │   ├── SocialShare.tsx
│   │   ├── TableOfContents.tsx
│   │   ├── RelatedPosts.tsx
│   │   ├── NotificationSystem.tsx
│   │   ├── UserProfile.tsx
│   │   └── PWAInstallPrompt.tsx
│   ├── lib/               # Utility functions and configurations
│   ├── offline/           # PWA offline page
│   └── globals.css        # Global styles
├── public/                # Static assets
│   ├── manifest.json      # PWA manifest
│   ├── sw.js             # Service worker
│   └── icons/            # PWA icons
├── prisma/               # Database schema and migrations
└── types/                # TypeScript type definitions
```

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run setup` - Set up database and initial data
- `npm run db:studio` - Open Prisma Studio
- `npm run generate-icons` - Generate PWA icon placeholders
- `npm run test:auth` - Test authentication functionality

## 🎯 Key Features in Detail

### 📖 Enhanced Reading Experience

#### Reading Progress Indicator
- Fixed progress bar at the top of blog posts
- Real-time scroll tracking with smooth animations
- Responsive design with gradient styling

#### Table of Contents
- **Desktop**: Sticky sidebar with auto-generated navigation
- **Mobile**: Floating button with modal popup
- Active section highlighting with smooth scrolling
- Supports nested headings (H1-H6)

#### Social Sharing
- Platform-specific sharing (Twitter, LinkedIn, Facebook)
- Native Web Share API for mobile devices
- Copy link functionality with visual feedback
- Custom SVG icons with hover effects

### 🛠 Admin Dashboard Features

#### Enhanced Admin Interface (`/admin/dashboard`)
- **Overview Tab**: User statistics and quick actions
- **Users Tab**: Complete user management with role controls
- **Content Tab**: Link to advanced content management

#### Advanced Content Editor (`/admin/content`)
- Full CRUD operations for blog posts
- Rich text editor with markdown support
- Draft/Published status management
- Tag management and SEO-friendly slug generation

### 📱 PWA Capabilities
- **App Manifest**: Proper metadata for installation
- **Service Worker**: Offline caching and background sync
- **Install Prompt**: Smart prompts for supported browsers
- **Offline Page**: Graceful fallback for network failures

## 🧪 Testing Features

Visit these pages to test the implemented features:

- **Blog Posts**: `/blog/getting-started` - Test TOC, reading progress, social sharing
- **Admin Dashboard**: `/admin/dashboard` - Test admin interface (requires admin role)
- **Content Editor**: `/admin/content` - Test advanced content management
- **PWA**: Check for install prompt on supported browsers

## 🚀 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, create an issue on GitHub or contact the maintainers.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- All contributors and the open-source community