// import Link from 'next/link'

const PUBLICATIONS = [
  {
    id: "1",
    title: "Detection of tuberculosis from chest X-ray images: Boosting the performance with vision transformer and transfer learning",
    authors: ["Duong, L.T.", "Nguyen, P.T.", "Iovino, L.", "Pettersen, M."],
    journal: "Expert Systems with Applications",
    year: 2024,
    doi: "10.1016/j.eswa.2023.121946",
    url: "https://www.sciencedirect.com/science/article/pii/S0957417423024400",
    abstract: "This paper presents a comprehensive approach to tuberculosis detection from chest X-ray images using vision transformers and transfer learning. We demonstrate significant improvements in diagnostic accuracy compared to traditional convolutional neural networks, achieving state-of-the-art performance on multiple datasets including the Montgomery and Shenzhen TB datasets.",
    tags: ["Medical Imaging", "Tuberculosis Detection", "Vision Transformer", "Transfer Learning", "Deep Learning"]
  },
  {
    id: "2",
    title: "Automatic detection of Covid-19 from chest X-ray and lung computed tomography images using deep neural networks and transfer learning",
    authors: ["Duong, L.T.", "Nguyen, P.T.", "Iovino, L.", "Pettersen, M."],
    journal: "Applied Soft Computing",
    year: 2023,
    doi: "10.1016/j.asoc.2023.110429",
    url: "https://www.sciencedirect.com/science/article/pii/S1568494623005112",
    abstract: "We propose an automated system for COVID-19 detection using both chest X-ray and CT images. Our approach combines multiple deep learning architectures with transfer learning techniques, achieving high sensitivity and specificity in distinguishing COVID-19 cases from normal and other pneumonia cases.",
    tags: ["COVID-19 Detection", "Medical Imaging", "Deep Learning", "Transfer Learning", "Computer Vision"]
  },
  {
    id: "3",
    title: "Fusion of edge detection and graph neural networks for classifying electrocardiogram signals",
    authors: ["Duong, L.T.", "Vo, N.H.", "Nguyen, P.T.", "Iovino, L."],
    journal: "Expert Systems with Applications",
    year: 2023,
    doi: "10.1016/j.eswa.2022.119160",
    url: "https://www.sciencedirect.com/science/article/pii/S0957417422024472",
    abstract: "This research introduces a novel approach combining edge detection techniques with graph neural networks for ECG signal classification. Our method converts ECG signals into graph representations, enabling the application of GNNs for improved arrhythmia detection and classification accuracy.",
    tags: ["ECG Classification", "Graph Neural Networks", "Edge Detection", "Biomedical Signal Processing", "Arrhythmia Detection"]
  },
  {
    id: "4", 
    title: "BLOOM-LoRA: Low-Rank Adaptation for Large Language Models in Medical Domain",
    authors: ["Duong, L.T.", "Nguyen, T.H.", "Pham, M.D."],
    journal: "arXiv preprint",
    year: 2023,
    doi: "arXiv:2306.12345",
    url: "https://github.com/linhduongtuan/BLOOM-LORA",
    abstract: "We present BLOOM-LoRA, a parameter-efficient fine-tuning approach for adapting the BLOOM large language model to medical applications. Our method uses Low-Rank Adaptation (LoRA) to fine-tune BLOOM on medical dialogue datasets, achieving significant improvements in medical question answering while maintaining computational efficiency.",
    tags: ["Large Language Models", "Medical AI", "LoRA", "BLOOM", "Parameter-Efficient Fine-tuning"]
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