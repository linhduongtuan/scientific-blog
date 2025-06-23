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
            <img 
              src="https://avatars.githubusercontent.com/u/22388092?v=4" 
              alt="Linh T. Duong"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="md:w-2/3">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Linh T. Duong</h2>
          <p className="text-gray-600 dark:text-gray-400 italic mb-6">PhD in Medical Microbiology | ML Researcher at KTH Royal Institute of Technology</p>
          
          <div className="prose max-w-none text-gray-800 dark:text-gray-200">
            <p>
              I obtained my PhD in medical microbiology from the University of Greifswald, Germany, and I am currently 
              working at KTH Royal Institute of Technology in Stockholm, Sweden. My research focuses on the intersection 
              of computational biology, medical microbiology, human genetics, epidemiology, and machine learning.
            </p>
            <p>
              My expertise spans developing machine learning models for medical imaging (particularly chest X-ray analysis 
              for tuberculosis and COVID-19 detection), fine-tuning large language models for medical applications, 
              and applying graph neural networks to biomedical signal processing. I'm particularly passionate about 
              making advanced AI techniques accessible for medical research and clinical applications.
            </p>
            <p>
              I actively contribute to open-source projects and have developed several popular repositories including 
              tuberculosis detection systems, COVID-19 diagnostic tools, and medical LLM fine-tuning frameworks. 
              My work has been recognized with significant community engagement on platforms like GitHub and Hugging Face.
            </p>
          </div>
        </div>
      </div>
      
      {/* Education Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 border-b border-gray-200 dark:border-gray-700 pb-2 dark:text-white">Education</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold dark:text-white">Ph.D. in Medical Microbiology</h3>
            <p className="text-gray-700 dark:text-gray-300">University of Greifswald, Germany, 2018-2022</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Focus: Computational approaches to microbial pathogenesis and antibiotic resistance
              <br />
              Thesis: "Machine Learning Applications in Medical Microbiology and Diagnostic Systems"
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold dark:text-white">M.Sc. in Biotechnology</h3>
            <p className="text-gray-700 dark:text-gray-300">Hanoi University of Science and Technology, Vietnam, 2014-2016</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Focus: Molecular Biology and Bioinformatics
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold dark:text-white">B.Sc. in Biomedical Engineering</h3>
            <p className="text-gray-700 dark:text-gray-300">Hanoi University of Science and Technology, Vietnam, 2010-2014</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Focus: Medical devices and biomedical signal processing
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
            <p className="text-gray-700 dark:text-gray-300 mb-2">KTH Royal Institute of Technology, Stockholm, Sweden</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
              <li>Conducting research in computational biology and medical AI applications</li>
              <li>Developing machine learning models for medical imaging and diagnostics</li>
              <li>Leading open-source projects in medical AI with 1000+ GitHub stars</li>
              <li>Collaborating with medical institutions on tuberculosis and COVID-19 detection systems</li>
            </ul>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <h3 className="text-xl font-semibold dark:text-white">PhD Researcher</h3>
              <span className="text-gray-600 dark:text-gray-400">2018-2022</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-2">University of Greifswald, Germany</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
              <li>Researched computational approaches to medical microbiology</li>
              <li>Developed machine learning models for pathogen identification and drug resistance prediction</li>
              <li>Published research in top-tier microbiology and bioinformatics journals</li>
              <li>Collaborated with clinical labs on diagnostic method validation</li>
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
                <p className="text-gray-600 dark:text-gray-400">Python, R, MATLAB, TypeScript/JavaScript, C++, SQL</p>
              </div>
              <div>
                <p className="font-medium dark:text-white">Machine Learning / AI</p>
                <p className="text-gray-600 dark:text-gray-400">PyTorch, TensorFlow, Timm, Hugging Face, Scikit-learn, Computer Vision, Medical AI</p>
              </div>
              <div>
                <p className="font-medium dark:text-white">Medical/Biological Tools</p>
                <p className="text-gray-600 dark:text-gray-400">Bioinformatics, Medical Imaging, DICOM Processing, Genomics Analysis, Epidemiological Modeling</p>
              </div>
              <div>
                <p className="font-medium dark:text-white">Development & Deployment</p>
                <p className="text-gray-600 dark:text-gray-400">Docker, Git, Linux/Unix, Jupyter, Google Colab, AWS, Model Deployment</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-3 dark:text-white">Research Skills</h3>
            <div className="space-y-3">
              <div>
                <p className="font-medium dark:text-white">Research Expertise</p>
                <p className="text-gray-600 dark:text-gray-400">Medical Microbiology, Computational Biology, Machine Learning for Healthcare</p>
              </div>
              <div>
                <p className="font-medium dark:text-white">Scientific Writing & Publishing</p>
                <p className="text-gray-600 dark:text-gray-400">Peer-reviewed Publications, Technical Documentation, Research Proposals</p>
              </div>
              <div>
                <p className="font-medium dark:text-white">Open Source Contribution</p>
                <p className="text-gray-600 dark:text-gray-400">GitHub Projects, Community Building, Code Reviews, Technical Mentoring</p>
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
            <p className="text-gray-600 dark:text-gray-400">lduong@kth.se</p>
          </div>
          <div>
            <p className="font-medium dark:text-white">Location</p>
            <p className="text-gray-600 dark:text-gray-400">Stockholm, Sweden</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <p className="font-medium dark:text-white">Social Media & Academic Profiles</p>
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
              <a href="https://scholar.google.com/citations?user=aZKRy1oAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                <span className="sr-only">Google Scholar</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" />
                </svg>
              </a>
              <a href="https://orcid.org/0000-0001-7411-1369" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                <span className="sr-only">ORCID</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947 0 .525-.422.947-.947.947-.525 0-.946-.422-.946-.947 0-.525.421-.947.946-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-1.016 5.016-4.72 5.016h-4.525V7.416zm1.444 1.303v7.444h2.297c2.272 0 3.272-1.272 3.272-3.722s-1.297-3.722-3.584-3.722h-1.985z"/>
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