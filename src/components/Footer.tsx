import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">Linh Duong</h3>
            <p className="text-gray-300 mt-2">Scientific Researcher & Developer</p>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
            <div>
              <h4 className="text-lg font-semibold mb-2">Navigation</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/publications" className="text-gray-300 hover:text-white transition-colors">Publications</Link></li>
                <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-2">Connect</h4>
              <ul className="space-y-2">
                <li><a href="https://github.com/linhduongtuan" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">GitHub</a></li>
                <li><a href="https://www.linkedin.com/in/linh-duong-746b0b9b/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="https://x.com/DuongTuanLinh1" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">Twitter</a></li>
                <li><a href="mailto:lduong@kth.se" className="text-gray-300 hover:text-white transition-colors">Email</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>© {currentYear} Linh Duong. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;