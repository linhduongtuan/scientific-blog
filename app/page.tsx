import Link from 'next/link'

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Linh Duong
            </h1>
            <h2 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 mb-6">
              Scientific Researcher & Developer
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Welcome to my personal website! I'm a researcher and developer specializing in 
              machine learning, data science, and scientific computing. Here you'll find my 
              latest research, publications, and thoughts on emerging technologies.
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
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-70"></div>
              <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold">
                Your Photo Here
              </div>
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
                title: "Machine Learning",
                description: "Exploring advanced ML techniques with applications in computer vision and natural language processing.",
                icon: "🧠"
              },
              {
                title: "Data Science",
                description: "Analyzing complex datasets to extract meaningful insights and patterns using statistical methods.",
                icon: "📊"
              },
              {
                title: "Scientific Computing",
                description: "Developing computational methods to solve scientific problems across various domains.",
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
                title: "Understanding Transformer Models in Natural Language Processing",
                date: "May 10, 2025",
                excerpt: "An in-depth look at how transformer models have revolutionized NLP tasks.",
                slug: "understanding-transformers"
              },
              {
                title: "Practical Applications of Machine Learning in Healthcare",
                date: "April 22, 2025",
                excerpt: "Exploring how ML is being used to improve patient outcomes and healthcare efficiency.",
                slug: "ml-in-healthcare"
              },
              {
                title: "Getting Started with Scientific Python",
                date: "March 15, 2025",
                excerpt: "A comprehensive guide to setting up a Python environment for scientific computing.",
                slug: "scientific-python-guide"
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