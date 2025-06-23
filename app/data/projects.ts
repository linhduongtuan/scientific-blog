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
    title: "Tuberculosis Chest X-ray Classifier",
    description: "Classification for chest X-ray images of tuberculosis using PyTorch, Timm, and modified EfficientNet family.",
    longDescription: `
      This repository implements a state-of-the-art tuberculosis detection system for chest X-ray images using deep learning. 
      The project is associated with our published paper "Detection of tuberculosis from chest X-ray images: Boosting the performance with vision transformer and transfer learning" in Expert Systems with Applications.
      
      Key features include:
      
      - Implementation of multiple CNN architectures including EfficientNet variants
      - Vision Transformer (ViT) integration for improved performance
      - Transfer learning from ImageNet and medical imaging datasets
      - Comprehensive evaluation on Montgomery and Shenzhen TB datasets
      - Data augmentation techniques specifically designed for medical imaging
      - Model interpretability through attention visualization and grad-CAM
      - Production-ready inference pipeline with Docker support
      
      The system achieves state-of-the-art performance with high sensitivity and specificity, making it suitable for clinical deployment. 
      The repository includes pre-trained models, training scripts, and evaluation metrics.
    `,
    technologies: ["Python", "PyTorch", "Timm", "OpenCV", "NumPy", "Matplotlib", "Jupyter"],
    category: "Medical AI",
    startDate: "2023-01",
    endDate: "2024-03",
    githubUrl: "https://github.com/linhduongtuan/Tuberculosis_ChestXray_Classifier",
    achievements: [
      "30 GitHub stars and 18 forks",
      "Published in Expert Systems with Applications (IF: 8.5)",
      "State-of-the-art performance on TB detection benchmarks",
      "Used by medical researchers for TB screening validation"
    ],
  },
  {
    id: "2",
    title: "COVID-19 X-ray Classifier",
    description: "Demo diagnosis tools for COVID-19 Chest X-ray detection using deep neural networks and transfer learning.",
    longDescription: `
      This project implements an automated COVID-19 detection system from chest X-ray and CT images using deep neural networks. 
      The work is published in Applied Soft Computing journal and demonstrates high accuracy in distinguishing COVID-19 cases from normal and pneumonia cases.
      
      Key contributions:
      
      - Multi-modal approach supporting both X-ray and CT images
      - Ensemble of multiple CNN architectures for robust predictions
      - Advanced data preprocessing and augmentation for medical images
      - Comprehensive evaluation on COVID-19 datasets including COVIDx
      - Uncertainty quantification for clinical decision support
      - Web-based demo application for real-time inference
      - Detailed ablation studies and performance analysis
      
      The system achieves high sensitivity and specificity, making it a valuable tool for COVID-19 screening in clinical settings. 
      The repository includes both research code and a deployable web application.
    `,
    technologies: ["Python", "TensorFlow", "Keras", "OpenCV", "Flask", "HTML/CSS", "JavaScript"],
    category: "Medical AI",
    startDate: "2022-03",
    endDate: "2023-06",
    githubUrl: "https://github.com/linhduongtuan/Covid-19_Xray_Classifier",
    achievements: [
      "14 GitHub stars and 7 forks",
      "Published in Applied Soft Computing (IF: 8.3)",
      "Deployed as web application for COVID-19 screening",
      "Cited by multiple COVID-19 detection studies"
    ],
  },
  {
    id: "3",
    title: "BLOOM-LoRA: Medical LLM Fine-tuning",
    description: "Parameter-efficient fine-tuning of BLOOM models using LoRA for medical dialogue and applications.",
    longDescription: `
      BLOOM-LoRA addresses the limitation of LLaMA licensing by implementing LoRA (Low-Rank Adaptation) fine-tuning for BLOOM models 
      in medical applications. This project provides a complete framework for adapting large language models to medical domains efficiently.
      
      Technical highlights:
      
      - Implementation of LoRA for parameter-efficient fine-tuning of BLOOM-7B1-MT
      - Integration with medical dialogue datasets (ChatDoctor-200k)
      - Memory-efficient training pipeline supporting limited GPU resources
      - Comprehensive evaluation on medical question-answering benchmarks
      - Hugging Face model hub integration for easy deployment
      - Support for multiple medical dialogue formats and languages
      - Detailed documentation and tutorials for medical researchers
      
      The project has gained significant community attention with 185 stars and has been used by researchers worldwide for medical AI applications. 
      Pre-trained models are available on Hugging Face for immediate use.
    `,
    technologies: ["Python", "PyTorch", "Transformers", "LoRA", "Hugging Face", "Accelerate", "Wandb"],
    category: "Natural Language Processing",
    startDate: "2023-04",
    endDate: "2023-08",
    githubUrl: "https://github.com/linhduongtuan/BLOOM-LORA",
    demoUrl: "https://huggingface.co/LinhDuong/doctorwithbloomz-7b1-mt",
    achievements: [
      "185 GitHub stars and 39 forks - most popular repository",
      "Models deployed on Hugging Face with 1000+ downloads",
      "Used by medical AI researchers for dialogue systems",
      "Featured in medical AI newsletters and forums"
    ],
  },
  {
    id: "4",
    title: "GraphECGNet: Graph Neural Networks for ECG Classification",
    description: "Fusion of edge detection and graph neural networks for classifying electrocardiogram signals.",
    longDescription: `
      GraphECGNet introduces a novel approach to ECG signal classification by converting time-series ECG data into graph representations 
      and applying Graph Neural Networks (GNNs) for arrhythmia detection. Published in Expert Systems with Applications.
      
      Innovation aspects:
      
      - Novel graph construction from ECG signals using edge detection
      - Custom GNN architecture optimized for ECG graph patterns
      - Multi-scale feature extraction from both temporal and spatial domains
      - Comprehensive evaluation on MIT-BIH and PTB diagnostic databases
      - Interpretability analysis showing which graph components contribute to classification
      - Real-time processing capabilities for clinical deployment
      - Robust performance across different ECG recording conditions
      
      The approach significantly outperforms traditional CNN and RNN methods for ECG classification, providing both high accuracy 
      and interpretable results that can assist cardiologists in diagnosis.
    `,
    technologies: ["Python", "PyTorch", "PyTorch Geometric", "NetworkX", "SciPy", "Matplotlib", "Seaborn"],
    category: "Biomedical Signal Processing",
    startDate: "2022-09",
    endDate: "2023-05",
    githubUrl: "https://github.com/linhduongtuan/GraphECGNet",
    achievements: [
      "22 GitHub stars and 3 forks",
      "Published in Expert Systems with Applications (IF: 8.5)",
      "Novel approach cited in graph-based biomedical signal processing papers",
      "Implementation used for ECG analysis in multiple research projects"
    ],
  },
  {
    id: "5",
    title: "DoctorWithBloom: Medical Chatbot",
    description: "Fine-tuned Bloomz-7b1-mt model using LoRA with the ChatDoctor-200k dataset for medical consultations.",
    longDescription: `
      DoctorWithBloom creates specialized medical chatbots by fine-tuning BLOOM language models on medical dialogue data. 
      The project addresses the need for accessible medical information and preliminary consultation tools.
      
      Key developments:
      
      - Fine-tuned multiple BLOOM variants (7B1-MT and 7B1) for medical dialogue
      - Comprehensive medical conversation dataset integration
      - Multi-turn dialogue capability for natural medical consultations
      - Safety measures and disclaimers for medical advice
      - Evaluation framework for medical dialogue quality
      - Deployment pipeline for web-based medical chatbot
      - Support for multiple languages in medical contexts
      
      The resulting models provide helpful medical information while maintaining appropriate cautions about professional medical advice. 
      The project has been used to create educational medical chatbots and research tools.
    `,
    technologies: ["Python", "PyTorch", "Transformers", "LoRA", "Gradio", "Hugging Face", "FastAPI"],
    category: "Medical AI",
    startDate: "2023-06",
    endDate: "2023-10",
    githubUrl: "https://github.com/linhduongtuan/doctorwithbloom",
    demoUrl: "https://huggingface.co/LinhDuong/doctorwithbloomz-7b1",
    achievements: [
      "30 GitHub stars and 5 forks",
      "Deployed medical chatbot with positive user feedback",
      "Used in medical education and training scenarios",
      "Integrated into telemedicine research projects"
    ],
  },
  {
    id: "6",
    title: "BKHN-Thesis Template (Typst)",
    description: "LaTeX to Typst conversion of thesis template for Hanoi University of Science and Technology.",
    longDescription: `
      This project provides a modern Typst-based thesis template for BKHN (Hanoi University of Science and Technology), 
      offering an alternative to traditional LaTeX templates with improved usability and compilation speed.
      
      Template features:
      
      - Complete conversion from LaTeX to Typst format
      - Vietnamese language support with proper typography
      - University-compliant formatting and styling
      - Automated bibliography and citation management
      - Figure and table handling with proper numbering
      - Mathematical equation formatting optimized for technical disciplines
      - Multiple output formats (PDF, web-ready)
      - Documentation and examples for easy adoption
      
      The template has been adopted by students and researchers at BKHN and other Vietnamese universities, 
      providing a modern alternative to LaTeX for thesis writing with faster compilation and easier syntax.
    `,
    technologies: ["Typst", "LaTeX", "Bibliography Management", "Vietnamese Typography", "PDF Generation"],
    category: "Academic Tools",
    startDate: "2023-11",
    endDate: "2024-02",
    githubUrl: "https://github.com/linhduongtuan/BKHN-Thesis_template_typst",
    achievements: [
      "27 GitHub stars and 10 forks",
      "Adopted by BKHN students for thesis writing",
      "Featured in Vietnamese academic communities",
      "Contributed to Typst ecosystem for academic writing"
    ],
  }
];