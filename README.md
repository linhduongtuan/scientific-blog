# Scientific Blog - Linh (Tuan) Duong

A modern, feature-rich scientific blog platform showcasing research in computational pathology, AI for medical imaging, and data science. Built with Next.js 14, featuring real-time scientific metrics dashboard, advanced content management, and comprehensive PWA capabilities.

## 🎓 About the Author

**Linh Duong Tuan** - Postdoctoral Researcher at The University of Bern, Switzerland  
**Research Focus**: Computational Pathology, AI for Medical Imaging, Computer Vision  
**Education**: PhD in Computer Science, Master's in Signal Processing  

- 🔬 **Research Areas**: Medical image analysis, digital pathology, machine learning in healthcare
- 📚 **Publications**: 20+ peer-reviewed papers in top-tier journals and conferences
- 💻 **Technical Expertise**: Python, PyTorch, TensorFlow, medical image processing
- 🌐 **Profiles**: [GitHub](https://github.com/linhduongtuan) | [Google Scholar](https://scholar.google.com/citations?user=F6eJ-5IAAAAJ) | [ORCID](https://orcid.org/0000-0002-4670-287X)

## ✨ Features

### 🎯 Core Features
- **Modern Stack**: Built with Next.js 14, TypeScript, and Tailwind CSS
- **Scientific Dashboard**: Real-time metrics from Google Scholar, GitHub, and research platforms
- **Authentication**: Secure user authentication with NextAuth.js
- **Content Management**: MDX-based blog posts with rich scientific formatting
- **Responsive Design**: Mobile-first design optimized for all devices
- **Dark Mode**: Built-in dark/light theme switching with system preference detection
- **Professional Branding**: Custom scientific logo with DNA helix design

### 📊 Scientific Dashboard (`/dashboard`)
- **📈 Citation Metrics**: Real-time Google Scholar stats (h-index, i10-index, total citations)
- **📚 Publication Analytics**: Publication trends over time with interactive charts
- **💻 GitHub Integration**: Repository statistics, contributions, and coding activity
- **🔬 Research Impact**: Impact factor tracking and collaboration networks
- **📊 Interactive Visualizations**: Dynamic charts using Chart.js and D3.js
- **🎯 Academic Goals**: Progress tracking for research milestones

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
- **🎨 Custom Favicon**: Professional DNA helix logo for brand recognition

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom components
- **Database**: Prisma with SQLite (easily configurable for other databases)
- **Authentication**: NextAuth.js with role-based access
- **Content**: MDX with syntax highlighting and rich components
- **Charts**: Chart.js for scientific data visualization
- **PWA**: Service Worker with offline caching
- **Notifications**: Custom toast system with persistence
- **Deployment**: Vercel with automatic deployments

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
PWA_NAME="Scientific Blog - Linh Duong Tuan"
PWA_SHORT_NAME="SciBlog"
PWA_DESCRIPTION="A blog about scientific computing, research, and data science"
```

## 📁 Project Structure

```
scientific-blog/
├── app/                    # Next.js 14 app directory
│   ├── dashboard/         # Scientific metrics dashboard
│   ├── admin/             # Admin dashboard and content management
│   │   ├── dashboard/     # Main admin dashboard
│   │   └── content/       # Advanced content editor
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── blog/              # Blog pages and components
│   ├── about/             # About page with researcher profile
│   ├── contact/           # Contact information
│   ├── projects/          # Research projects showcase
│   ├── publications/      # Academic publications list
│   ├── components/        # Reusable components
│   │   ├── ScientificDashboard.tsx  # Real-time metrics dashboard
│   │   ├── ReadingProgress.tsx      # Reading progress indicator
│   │   ├── SocialShare.tsx          # Social sharing buttons
│   │   ├── TableOfContents.tsx      # Dynamic TOC
│   │   ├── RelatedPosts.tsx         # Related posts suggestions
│   │   ├── NotificationSystem.tsx   # Toast notifications
│   │   ├── UserProfile.tsx          # User profile management
│   │   └── PWAInstallPrompt.tsx     # PWA install prompt
│   ├── lib/               # Utility functions and configurations
│   ├── offline/           # PWA offline page
│   └── globals.css        # Global styles
├── public/                # Static assets
│   ├── favicon.svg        # Custom scientific logo (SVG)
│   ├── favicon.ico        # Browser favicon
│   ├── manifest.json      # PWA manifest
│   ├── sw.js             # Service worker
│   └── icons/            # PWA icons (multiple sizes)
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

## 🎯 Live Features

### � Scientific Content

- **Research Focus**: Computational pathology and AI for medical imaging
- **Publications**: 20+ peer-reviewed papers with DOI links and abstracts
- **Projects**: Real GitHub repositories with live statistics
- **Contact**: University and research institute information

### 📊 Interactive Dashboard

Visit `/dashboard` to explore:

- Real-time citation metrics from Google Scholar
- GitHub contribution patterns and repository statistics
- Publication timeline with interactive charts
- Research impact visualization
- Academic milestone tracking

### 📖 Blog Content

- **Technical Posts**: Scientific computing tutorials and research insights
- **MDX Support**: Rich formatting with code highlighting and mathematical equations
- **Reading Experience**: Progress tracking, TOC navigation, and social sharing
- **Responsive Design**: Optimized for desktop and mobile reading

## 🚀 Deployment

### Live Site

**Production URL**: [https://scientific-blog-lovat.vercel.app/](https://scientific-blog-lovat.vercel.app/)

### Deploy Your Own

1. **Fork this repository**
2. **Connect to Vercel**:
   - Import your GitHub repository
   - Configure environment variables
   - Deploy automatically

3. **Custom Domain** (optional):
   - Add your domain in Vercel dashboard
   - Update DNS settings

## 🧪 Testing Features

Visit these pages to explore the implemented features:

- **Home**: `/` - Updated with real profile information and avatar
- **About**: `/about` - Complete academic background and research interests  
- **Publications**: `/publications` - Real research papers with abstracts and DOI links
- **Projects**: `/projects` - Live GitHub repositories with metrics
- **Dashboard**: `/dashboard` - Interactive scientific metrics dashboard
- **Blog Posts**: `/blog/getting-started` - Test TOC, reading progress, social sharing
- **Admin Dashboard**: `/admin/dashboard` - Admin interface (requires admin role)
- **Content Editor**: `/admin/content` - Advanced content management
- **PWA**: Check for install prompt on supported browsers

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
- Chart.js for scientific data visualization
- The computational pathology and medical AI research community
- All contributors and the open-source community
