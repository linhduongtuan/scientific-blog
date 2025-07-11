import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Linh T. Duong
            </h1>
            <h2 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 mb-6">
              PhD in Medical Microbiology & ML Researcher
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Welcome to my personal website! I&apos;m a researcher with a PhD in medical microbiology from the University of Greifswald, Germany, 
              currently at KTH Royal Institute of Technology in Stockholm. I specialize in computational biology, medical microbiology, 
              machine learning, and epidemiology. Explore my research, publications, and open-source contributions.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/about" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors">
                About Me
              </Link>
              <Link href="/blog" className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-6 rounded-md transition-colors">
                Read My Blog
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
            <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
              <Image
                src="https://avatars.githubusercontent.com/u/22388092?v=4"
                alt="Linh T. Duong"
                className="w-full h-full object-cover"
                width={320}
                height={320}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Research Interests */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Research Interests</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Medical Microbiology",
                description: "Researching microbial pathogenesis, antibiotic resistance, and diagnostic methods using computational approaches.",
                icon: "�"
              },
              {
                title: "Machine Learning & AI",
                description: "Applying deep learning to medical imaging, disease diagnosis, and biological data analysis using PyTorch and TensorFlow.",
                icon: "🧠"
              },
              {
                title: "Computational Biology",
                description: "Developing computational methods for genomics, epidemiology, and human genetics research.",
                icon: "🔬"
              }
            ].map((item, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-3 dark:text-white">{item.title}</h3>
                <p className="text-gray-700 dark:text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blog Posts Section */}
      <section className="py-12">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold dark:text-white">Latest Blog Posts</h2>
            <Link href="/blog" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Deep Learning for Tuberculosis Detection in Chest X-rays",
                date: "June 15, 2025",
                excerpt: "Leveraging EfficientNet and advanced data augmentation techniques to achieve 95.8% accuracy in TB detection from chest radiographs.",
                slug: "tuberculosis-detection-chest-xray"
              },
              {
                title: "Transformer Networks for Histopathology Image Analysis",
                date: "May 28, 2025",
                excerpt: "Exploring Vision Transformers (ViTs) for automated cancer detection in whole slide images with attention mechanism visualization.",
                slug: "transformers-histopathology-analysis"
              },
              {
                title: "Graph Neural Networks for Multi-Modal Medical Data Integration",
                date: "May 12, 2025",
                excerpt: "Novel GNN architecture combining imaging, genomics, and clinical data for personalized cancer treatment prediction.",
                slug: "gnn-multimodal-medical-data"
              }
            ].map((post, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-md">
                <div className="p-6">
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">{post.date}</p>
                  <h3 className="text-xl font-semibold mb-3 dark:text-white">{post.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}