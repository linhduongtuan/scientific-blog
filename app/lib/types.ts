export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  readingTime: string;
  excerpt: string;
  tags?: string[];
  content: string;
}