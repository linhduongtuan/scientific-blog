"use client"

import React, { useState, useEffect } from 'react'

// Direct imports with client-side guards - using simplified components for testing
import MedicalImageViewer from '../components/SimpleMedicalViewer'
import ResearchDataPortal from '../components/SimpleDataPortal'
import DigitalLabNotebook from '../components/SimpleLabNotebook'

// Simple loading component
const LoadingComponent = ({ title }: { title: string }) => (
  <div className="w-full max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
      <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
      <div className="text-center text-gray-500 dark:text-gray-400">
        Loading {title}...
      </div>
    </div>
  </div>
)

export default function MedicalResearchPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
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
          {mounted ? (
            <MedicalImageViewer />
          ) : (
            <LoadingComponent title="Medical Image Viewer" />
          )}
        </div>

        {/* Research Data Portal Section */}
        <div className="mb-12">
          {mounted ? (
            <ResearchDataPortal />
          ) : (
            <LoadingComponent title="Research Data Portal" />
          )}
        </div>

        {/* Digital Lab Notebook Section */}
        <div className="mb-12">
          {mounted ? (
            <DigitalLabNotebook />
          ) : (
            <LoadingComponent title="Digital Lab Notebook" />
          )}
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
