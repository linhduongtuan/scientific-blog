import Link from 'next/link'

const PUBLICATIONS = [
  {
    id: "1",
    title: "Advanced Neural Networks for Scientific Computing",
    authors: ["Duong, L.", "Smith, J.", "Johnson, A."],
    journal: "Journal of Computational Science",
    year: 2024,
    doi: "10.1234/jcs.2024.001",
    url: "https://example.com/papers/neural-networks",
    abstract: "This paper presents a novel approach to using neural networks for solving complex scientific computing problems. We demonstrate significant improvements in computational efficiency and accuracy compared to traditional methods.",
    tags: ["Neural Networks", "Scientific Computing", "Machine Learning"]
  },
  {
    id: "2",
    title: "Machine Learning Applications in Bioinformatics",
    authors: ["Wong, R.", "Duong, L.", "García, M."],
    journal: "Computational Biology Journal",
    year: 2023,
    doi: "10.5678/cbj.2023.045",
    url: "https://example.com/papers/ml-bioinformatics",
    abstract: "We review recent applications of machine learning techniques in bioinformatics, with a focus on genomic data analysis and protein structure prediction. The paper highlights key challenges and opportunities in this rapidly evolving field.",
    tags: ["Bioinformatics", "Machine Learning", "Genomics"]
  },
  {
    id: "3",
    title: "Efficient Algorithms for Large-Scale Data Processing",
    authors: ["Duong, L.", "Kumar, P."],
    journal: "Data Science Technology",
    year: 2023,
    doi: "10.9012/dst.2023.012",
    url: "https://example.com/papers/large-scale-algorithms",
    abstract: "This research introduces a family of efficient algorithms designed specifically for processing extremely large datasets. Our methods show significant improvements in both time and space complexity compared to state-of-the-art approaches.",
    tags: ["Algorithms", "Big Data", "Optimization"]
  }
];

export default function Publications() {
  // Current date and user information
  const currentDate = "2025-05-17 16:45:36";
  const currentUser = "linhduongtuan";

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 dark:text-white">Publications</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          My academic publications and research papers in machine learning, data science, and scientific computing.
          <span className="text-sm text-gray-500 dark:text-gray-400 block mt-2">
            Last updated: {currentDate.split(' ')[0]} by {currentUser}
          </span>
        </p>
      </div>
      
      {/* Publications List */}
      <div className="space-y-8">
        {PUBLICATIONS.map(pub => (
          <div key={pub.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
            <h2 className="text-xl font-bold mb-2 dark:text-white">{pub.title}</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">{pub.authors.join(", ")}</p>
            <p className="text-gray-600 dark:text-gray-400 italic mb-4">{pub.journal}, {pub.year}</p>
            
            {pub.abstract && (
              <div className="mb-4">
                <p className="text-gray-800 dark:text-gray-200">{pub.abstract}</p>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2 mb-4">
              {pub.tags.map(tag => (
                <span 
                  key={tag} 
                  className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex gap-4">
              {pub.doi && (
                <a 
                  href={`https://doi.org/${pub.doi}`} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  DOI: {pub.doi}
                </a>
              )}
              {pub.url && (
                <a 
                  href={pub.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  View Paper
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}