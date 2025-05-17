export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  category: string;
  startDate: string;
  endDate: string | null;
  imageUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  achievements?: string[];
  collaborators?: string[];
}

export const PROJECTS: Project[] = [
  {
    id: "1",
    title: "NeuralSim: Deep Learning Framework for Scientific Computing",
    description: "A specialized deep learning framework optimized for scientific computing applications, including custom layers for physical simulations.",
    longDescription: `
      NeuralSim is a comprehensive deep learning framework designed specifically for scientific computing applications. Unlike general-purpose frameworks, NeuralSim includes specialized layers and loss functions tailored to physical simulations, differential equation solving, and scientific data processing.
      
      The framework provides implementations of physics-informed neural networks (PINNs), neural operators, and differentiable simulation components. It supports automatic differentiation through complex scientific computations, enabling researchers to incorporate physical constraints and domain knowledge directly into neural network architectures.
      
      Key features include:
      
      - Custom neural network layers for solving PDEs and ODEs
      - Differentiable physics simulators that can be incorporated into training pipelines
      - GPU-accelerated implementations of common scientific computing operations
      - Interfaces with popular dataset formats in scientific computing
      - Visualization tools for scientific outputs
      - Extensible architecture allowing researchers to implement custom physics-based layers
      
      The project has been used by research groups in computational fluid dynamics, materials science, and climate modeling to accelerate simulations and develop hybrid neural-physical models.
    `,
    technologies: ["Python", "TensorFlow", "JAX", "NumPy", "CUDA", "C++", "Docker"],
    category: "Scientific Computing",
    startDate: "2024-09",
    endDate: null,
    imageUrl: "/images/neuralsim.jpg",
    githubUrl: "https://github.com/linhduongtuan/neuralsim",
    demoUrl: "https://neuralsim.demo.com",
    achievements: [
      "Published in Journal of Machine Learning for Scientific Computing (2025)",
      "3,000+ GitHub stars",
      "Adopted by 5 research laboratories for materials simulation",
      "Featured in NVIDIA developer blog for GPU optimization"
    ],
    collaborators: [
      "Stanford University Computational Physics Group", 
      "National Laboratory for Advanced Simulation"
    ]
  },
  {
    id: "2",
    title: "MedVision: Advanced Medical Image Analysis Pipeline",
    description: "End-to-end pipeline for analyzing medical images using deep learning techniques with modules for preprocessing, segmentation, and classification.",
    longDescription: `
      MedVision is a comprehensive medical image analysis pipeline built on deep learning technologies. The system provides end-to-end functionality for processing and analyzing various medical imaging modalities, including MRI, CT, X-ray, and ultrasound.
      
      The pipeline consists of several interconnected modules:
      
      - Preprocessing: Automated cleaning, normalization, and standardization of medical images from different sources
      - Segmentation: State-of-the-art neural networks for organ/tissue segmentation with support for 3D volumes
      - Classification: Disease classification and abnormality detection systems
      - Registration: Multi-modal image registration capabilities
      - Visualization: Specialized visualization tools for medical professionals
      
      MedVision integrates several novel technical approaches, including attention-gated segmentation networks, uncertainty quantification for clinical decision support, and federated learning capabilities for multi-institution collaboration while maintaining data privacy.
      
      The system is designed with clinical deployment in mind, featuring DICOM compatibility, integration capabilities with hospital PACS systems, and rigorous validation metrics for regulatory considerations.
    `,
    technologies: ["Python", "PyTorch", "OpenCV", "scikit-learn", "Flask", "MONAI", "SimpleITK", "Docker"],
    category: "Healthcare",
    startDate: "2024-06",
    endDate: "2025-03",
    imageUrl: "/images/medvision.jpg",
    githubUrl: "https://github.com/linhduongtuan/medvision",
    achievements: [
      "88% accuracy on brain tumor segmentation benchmark",
      "Reduced radiologist annotation time by 65%",
      "Successfully validated on 1,200+ patient scans",
      "Under evaluation for clinical deployment at University Medical Center"
    ],
    collaborators: [
      "University Medical Center Radiology Department", 
      "National Center for Biomedical Imaging"
    ]
  },
  {
    id: "3",
    title: "SciViz: Interactive Scientific Data Visualization Dashboard",
    description: "Interactive web dashboard for visualizing complex scientific datasets with multiple visualization types and real-time exploration capabilities.",
    longDescription: `
      SciViz is a sophisticated web-based dashboard designed specifically for interactive visualization and exploration of complex scientific datasets. The platform supports multiple visualization types and allows researchers to dynamically explore data relationships through an intuitive interface.
      
      Key features of SciViz include:
      
      - High-dimensional data visualization using techniques like t-SNE, UMAP, and PCA
      - Interactive 3D rendering of molecular structures, simulation results, and volumetric data
      - Time-series analysis tools with animation capabilities
      - Custom visualization components for domain-specific data types
      - Collaborative features allowing multiple researchers to explore and annotate visualizations
      - Integration with common scientific data formats and databases
      - Export functionality for publication-quality figures
      
      The dashboard is built on a modern web stack with React for UI components, D3.js for customized visualizations, and a Node.js backend for data processing. The architecture supports handling large datasets through techniques like data streaming, server-side aggregation, and WebGL acceleration.
      
      SciViz has been deployed in several research settings, including materials science laboratories, genomics research centers, and climate modeling groups, where it has enabled new insights through interactive data exploration.
    `,
    technologies: ["TypeScript", "React", "D3.js", "Three.js", "Next.js", "Tailwind CSS", "Node.js", "WebGL"],
    category: "Data Visualization",
    startDate: "2024-04",
    endDate: "2024-12",
    imageUrl: "/images/sciviz.jpg",
    githubUrl: "https://github.com/linhduongtuan/sciviz",
    demoUrl: "https://sciviz.demo.com",
    achievements: [
      "Featured in Scientific Data Visualization Conference 2025",
      "Handles datasets up to 1M data points with interactive performance",
      "Used in 3 published research papers for visualization",
      "500+ active monthly users across research institutions"
    ]
  },
  {
    id: "4",
    title: "ScholarRec: Research Paper Recommendation System",
    description: "Personalized recommendation system for scientific papers using natural language processing and collaborative filtering techniques.",
    longDescription: `
      ScholarRec is an advanced recommendation system designed to help researchers discover relevant scientific literature based on their reading history, research interests, and publication patterns. The system combines natural language processing for content analysis with collaborative filtering for personalization.
      
      The core components of ScholarRec include:
      
      - Content Analysis: Uses transformer-based models to analyze paper content, extracting topics, methodologies, and key findings
      - Citation Network Analysis: Leverages the structure of citation networks to identify influential and related works
      - Collaborative Filtering: Identifies patterns in reading and citation behavior across researchers with similar interests
      - User Profiling: Builds dynamic research interest profiles based on reading history and publications
      - Diversity Promotion: Algorithms to ensure recommendation diversity, balancing relevance with serendipitous discovery
      
      The system continuously learns from user interactions, refining recommendations based on explicit feedback (ratings, saves) and implicit signals (reading time, citation actions). It also incorporates recency factors to highlight newly published research relevant to a user's interests.
      
      ScholarRec is implemented as a microservice architecture with a FastAPI backend, MongoDB for storing paper metadata and user profiles, and Elasticsearch for efficient semantic search capabilities.
    `,
    technologies: ["Python", "Scikit-learn", "PyTorch", "Transformers", "NLTK", "MongoDB", "FastAPI", "Elasticsearch"],
    category: "Natural Language Processing",
    startDate: "2024-02",
    endDate: "2024-10",
    imageUrl: "/images/scholarrec.jpg",
    githubUrl: "https://github.com/linhduongtuan/scholarrec",
    achievements: [
      "Processes and indexes over 2 million scientific papers",
      "Achieved 78% precision@10 in recommendation quality evaluation",
      "Reduced literature search time by 45% in user studies",
      "Integrated with university library systems at 2 research institutions"
    ],
    collaborators: [
      "University Digital Library", 
      "Research Information Systems Lab"
    ]
  },
  {
    id: "5",
    title: "BioCompute: Computational Biology Toolkit",
    description: "Suite of tools for computational biology research, including sequence analysis, protein structure prediction, and genomic data processing.",
    longDescription: `
      BioCompute is a comprehensive toolkit for computational biology research, providing integrated solutions for sequence analysis, protein structure prediction, and genomic data processing. The toolkit is designed to be modular and extensible, allowing researchers to incorporate new methods and adapt existing ones to their specific needs.
      
      Key modules in BioCompute include:
      
      - Sequence Analysis: Tools for alignment, motif discovery, and phylogenetic analysis
      - Structural Biology: Protein structure prediction using deep learning models and molecular dynamics simulations
      - Genomics: Pipelines for variant calling, gene expression analysis, and genome assembly
      - Systems Biology: Network analysis and pathway modeling capabilities
      - Machine Learning Integration: Pre-implemented ML models for common bioinformatics tasks with easy extension points
      
      The toolkit emphasizes reproducibility and scalability, using Nextflow for workflow management to enable execution across different computing environments from laptops to HPC clusters. All analyses are automatically documented, with provenance tracking for data transformations.
      
      BioCompute incorporates several novel algorithms, including a transformer-based protein structure prediction model that achieves competitive results with AlphaFold while requiring less computational resources, and a graph neural network approach for protein-protein interaction prediction.
    `,
    technologies: ["Python", "BioPython", "TensorFlow", "PyMOL", "R", "Nextflow", "Docker", "CUDA"],
    category: "Bioinformatics",
    startDate: "2023-11",
    endDate: "2024-08",
    imageUrl: "/images/biocompute.jpg",
    githubUrl: "https://github.com/linhduongtuan/biocompute",
    demoUrl: "https://biocompute.demo.com",
    achievements: [
      "Downloaded by 1,500+ researchers in first six months",
      "Protein structure prediction model achieved top-5 ranking in CASP15 competition",
      "Significantly reduced runtime for standard genomic analyses (85% faster variant calling)",
      "Featured in Nature Methods' 'Technology Feature' section"
    ],
    collaborators: [
      "Center for Computational Biology", 
      "Genomics Institute", 
      "Structural Biology Consortium"
    ]
  },
  {
    id: "6",
    title: "ClimateML: Machine Learning for Climate Data Analysis",
    description: "Framework for applying machine learning techniques to climate data, including prediction models and pattern recognition tools.",
    longDescription: `
      ClimateML is a specialized framework for applying machine learning techniques to climate data analysis and modeling. The project addresses the unique challenges of climate data, including spatial and temporal dependencies, multi-scale dynamics, and physical consistency requirements.
      
      The framework includes:
      
      - Data Processing: Tools for handling common climate data formats (NetCDF, GRIB), regridding, and temporal aggregation
      - Feature Engineering: Physics-informed feature creation specifically designed for climate variables
      - Model Library: Implementations of ML models adapted for climate applications, including specialized CNNs for spatial data and recurrent architectures for temporal forecasting
      - Evaluation Tools: Climate-specific metrics and validation approaches that incorporate domain knowledge
      - Interpretation Methods: Techniques for extracting physical insights from ML models in the climate context
      
      ClimateML emphasizes physical consistency and interpretability, with built-in constraints to ensure predictions adhere to conservation laws and other physical principles. It includes implementations of hybrid models that combine data-driven approaches with physical simulations.
      
      The framework has been applied to various climate problems, including extreme event prediction, downscaling of climate model outputs, and identification of climate patterns in observational data.
    `,
    technologies: ["Python", "TensorFlow", "Xarray", "Dask", "cartopy", "NCL", "CUDA", "Kubernetes"],
    category: "Environmental Science",
    startDate: "2023-09",
    endDate: "2024-07",
    imageUrl: "/images/climateml.jpg",
    githubUrl: "https://github.com/linhduongtuan/climateml",
    achievements: [
      "Successfully predicted regional precipitation extremes with 3-4 week lead time",
      "Reduced computational requirements for regional climate modeling by 90%",
      "Used in climate vulnerability assessments by environmental agencies",
      "Models incorporated into operational climate monitoring system at National Weather Service"
    ],
    collaborators: [
      "Climate Research Center", 
      "Environmental Data Science Lab", 
      "National Weather Service"
    ]
  }
];