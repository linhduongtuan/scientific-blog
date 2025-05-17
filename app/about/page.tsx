import Link from 'next/link'

export default function About() {
  // Current date and user information
  const currentDate = "2025-05-17 16:45:36";
  const currentUser = "linhduongtuan";

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 dark:text-white">About Me</h1>
      
      <div className="flex flex-col md:flex-row gap-10 mb-12">
        <div className="md:w-1/3">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-70"></div>
            <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold">
              Your Photo Here
            </div>
          </div>
        </div>
        
        <div className="md:w-2/3">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Linh Duong</h2>
          <p className="text-gray-600 dark:text-gray-400 italic mb-6">Researcher & Developer in Machine Learning</p>
          
          <div className="prose max-w-none text-gray-800 dark:text-gray-200">
            <p>
              I am a researcher and developer specializing in machine learning, data science, and scientific computing. 
              With a background in computer science and mathematics, I focus on developing novel computational methods 
              to solve complex problems across various scientific domains.
            </p>
            <p>
              My research interests include deep learning architectures, natural language processing, computer vision, 
              and their applications in fields like healthcare, bioinformatics, and environmental science. I am 
              particularly passionate about making advanced machine learning techniques more accessible and 
              interpretable for scientific researchers.
            </p>
            <p>
              When I'm not coding or conducting research, I enjoy hiking, photography, and contributing to open-source 
              projects.
            </p>
          </div>
        </div>
      </div>
      
      {/* Education Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 border-b border-gray-200 dark:border-gray-700 pb-2 dark:text-white">Education</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold dark:text-white">Ph.D. in Computer Science</h3>
            <p className="text-gray-700 dark:text-gray-300">University of Technology, 2018-2022</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Focus: Machine Learning for Scientific Applications
              <br />
              Thesis: "Advanced Neural Network Architectures for Scientific Data Analysis"
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold dark:text-white">M.Sc. in Applied Mathematics</h3>
            <p className="text-gray-700 dark:text-gray-300">National University, 2016-2018</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Focus: Computational Mathematics and Statistics
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold dark:text-white">B.Sc. in Computer Science</h3>
            <p className="text-gray-700 dark:text-gray-300">State University, 2012-2016</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Minor: Mathematics
            </p>
          </div>
        </div>
      </section>
      
      {/* Professional Experience Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 border-b border-gray-200 dark:border-gray-700 pb-2 dark:text-white">Professional Experience</h2>
        <div className="space-y-8">
          <div>
            <div className="flex justify-between mb-1">
              <h3 className="text-xl font-semibold dark:text-white">Research Scientist</h3>
              <span className="text-gray-600 dark:text-gray-400">2022-Present</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-2">Tech Research Institute</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
              <li>Leading research projects in machine learning for scientific applications</li>
              <li>Developing novel algorithms for complex data analysis</li>
              <li>Publishing research in top-tier journals and conferences</li>
              <li>Collaborating with interdisciplinary teams on cutting-edge projects</li>
            </ul>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <h3 className="text-xl font-semibold dark:text-white">Data Science Consultant</h3>
              <span className="text-gray-600 dark:text-gray-400">2020-2022</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-2">Innovation Labs</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
              <li>Provided expert consultation on machine learning implementation</li>
              <li>Developed custom data analysis solutions for various industries</li>
              <li>Conducted workshops and training sessions on advanced data science techniques</li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* Skills Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 border-b border-gray-200 dark:border-gray-700 pb-2 dark:text-white">Skills</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-3 dark:text-white">Technical Skills</h3>
            <div className="space-y-3">
              <div>
                <p className="font-medium dark:text-white">Programming Languages</p>
                <p className="text-gray-600 dark:text-gray-400">Python, TypeScript/JavaScript, R, MATLAB, C++</p>
              </div>
              <div>
                <p className="font-medium dark:text-white">Machine Learning / AI</p>
                <p className="text-gray-600 dark:text-gray-400">TensorFlow, PyTorch, Scikit-learn, Keras, Computer Vision, NLP</p>
              </div>
              <div>
                <p className="font-medium dark:text-white">Data Science</p>
                <p className="text-gray-600 dark:text-gray-400">Pandas, NumPy, SciPy, Data Visualization, Statistical Analysis</p>
              </div>
              <div>
                <p className="font-medium dark:text-white">Web Development</p>
                <p className="text-gray-600 dark:text-gray-400">React, Next.js, Node.js, Express, HTML/CSS</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-3 dark:text-white">Research Skills</h3>
            <div className="space-y-3">
              <div>
                <p className="font-medium dark:text-white">Research Methodologies</p>
                <p className="text-gray-600 dark:text-gray-400">Experimental Design, Literature Review, Data Collection</p>
              </div>
              <div>
                <p className="font-medium dark:text-white">Scientific Writing</p>
                <p className="text-gray-600 dark:text-gray-400">Academic Papers, Technical Reports, Grant Proposals</p>
              </div>
              <div>
                <p className="font-medium dark:text-white">Communication</p>
                <p className="text-gray-600 dark:text-gray-400">Conference Presentations, Technical Workshops, Interdisciplinary Collaboration</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Information */}
      <section>
        <h2 className="text-2xl font-bold mb-6 border-b border-gray-200 dark:border-gray-700 pb-2 dark:text-white">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="font-medium dark:text-white">Email</p>
            <p className="text-gray-600 dark:text-gray-400">research@linhduong.com</p>
          </div>
          <div>
            <p className="font-medium dark:text-white">Social Media & Profiles</p>
            <div className="flex space-x-4 mt-2">
              <a href="https://github.com/linhduongtuan" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://linkedin.com/in/linhduongtuan" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="https://twitter.com/linhduongtuan" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        {/* Last updated notice */}
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-8 text-right">
          Last updated: {currentDate} by {currentUser}
        </div>
      </section>
    </div>
  )
}