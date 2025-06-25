"use client"

import React from 'react'
import MedicalImageViewer from '../components/MedicalImageViewer'
import ResearchDataPortal from '../components/ResearchDataPortal'
import DigitalLabNotebook from '../components/DigitalLabNotebook'

export default function MedicalResearchPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🔬 Medical Research Platform
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Comprehensive medical image analysis, research data management, and digital lab notebook system 
            for modern medical research and collaboration.
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
            <div className="text-center">
              <div className="text-4xl mb-4">🩺</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Medical Image Viewer
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                DICOM support, annotation tools, measurement capabilities, and image comparison features.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Research Data Portal
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Dataset sharing, version control, reproducible research tools, and collaborative features.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
            <div className="text-center">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Digital Lab Notebook
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Experiment tracking, protocol sharing, measurement recording, and research documentation.
              </p>
            </div>
          </div>
        </div>

        {/* Medical Image Viewer Section */}
        <div className="mb-12">
          <MedicalImageViewer />
        </div>

        {/* Research Data Portal Section */}
        <div className="mb-12">
          <ResearchDataPortal />
        </div>

        {/* Digital Lab Notebook Section */}
        <div className="mb-12">
          <DigitalLabNotebook />
        </div>

        {/* Key Features Summary */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            🚀 Platform Capabilities
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                🔬 Medical Image Analysis
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• DICOM file support and processing</li>
                <li>• Interactive annotation tools</li>
                <li>• Measurement and ROI marking</li>
                <li>• Side-by-side image comparison</li>
                <li>• Difference analysis and SSIM scoring</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                📊 Data Management
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Dataset version control</li>
                <li>• Collaborative data sharing</li>
                <li>• Metadata management</li>
                <li>• Reproducibility tracking</li>
                <li>• Research integrity tools</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                📝 Research Documentation
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Digital lab notebook</li>
                <li>• Experiment tracking</li>
                <li>• Protocol sharing</li>
                <li>• Measurement recording</li>
                <li>• Research collaboration</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">
            🛠️ Technology Stack
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Frontend</h4>
              <p className="text-sm">React, Next.js, TypeScript, Tailwind CSS</p>
            </div>
            
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Medical Imaging</h4>
              <p className="text-sm">DICOM Parser, Cornerstone.js, Canvas API</p>
            </div>
            
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Data Visualization</h4>
              <p className="text-sm">Chart.js, Plotly.js, D3.js</p>
            </div>
            
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Backend</h4>
              <p className="text-sm">Prisma, SQLite, API Routes</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            Ready to revolutionize your medical research workflow?
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  )
}
