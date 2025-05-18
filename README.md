# Scientific Blog Platform

![Scientific Blog Platform](public/images/scientific-blog-banner.png)

A modern, responsive blog platform built with Next.js 14, focused on scientific and research content with enhanced code blocks, dark mode support, and MDX content.

## Features

- **Modern React & Next.js 14**: Utilizes the latest React features and Next.js App Router
- **MDX Support**: Write content with Markdown + JSX
- **Code Syntax Highlighting**: Enhanced code blocks with language detection and copy functionality
- **Dark Mode Support**: Seamless light/dark mode switching
- **Responsive Design**: Mobile-first approach for all devices
- **Blog Management**: Categorization, tagging, and searching
- **Interactive Components**: Subscription form with custom questions
- **SEO Optimized**: Built-in metadata support
- **TypeScript**: Type-safe development experience

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Content**: MDX with next-mdx-remote
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/linhduongtuan/scientific-blog.git
   cd scientific-blog
   ```

2. Install dependencies:
   ```bash
   npm install
    # or
    yarn install
    ```
3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.   

### Project Structure
---
```markdown
scientific-blog/
├── app/                    # Next.js App Router
│   ├── about/              # About page
│   ├── blog/               # Blog pages
│   │   ├── [slug]/         # Dynamic blog post page
│   │   └── page.tsx        # Blog listing page
│   ├── components/         # React components
│   ├── content/            # MDX content
│   │   └── blog/           # Blog posts as MDX files
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   ├── lib/                # Utility functions
│   │   └── mdx.ts          # MDX processing utilities
│   └── page.tsx            # Home page
├── public/                 # Static assets
├── next.config.js          # Next.js configuration
├── package.json            # Project dependencies
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

### Creating Content
---
#### Creating Blog Posts

1. Add a new MDX file in app/content/blog/
2. Include frontmatter at the top of the file:

```MDX
---
title: "Your Blog Post Title"
date: "2025-05-17"
author: "Your Name"
excerpt: "A brief summary of your blog post"
tags: ["science", "research", "tutorial"]
readingTime: "5 min read"
---

Your content here...
```

#### Using Code Blocks
Code blocks with syntax highlighting and copy button:

```md
```python
def hello_world():
    print("Hello, World!")
```

### Deployment
---
The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

### Contributing
---
Contributions are welcome! Please feel free to submit a Pull Request.

### License
---
This project is licensed under the MIT License - see the LICENSE file for details.