"use client"

import React, { useState, useEffect } from 'react'
import { Database, Upload, Download, GitBranch, Users, Search } from 'lucide-react'

interface Dataset {
  id: number
  name: string
  description: string
  author: string
  version: string
  created_at: string
}

export default function ResearchDataPortalOptimized() {
  const [mounted, setMounted] = useState(false)
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null)

  const mockDatasets: Dataset[] = [
    {
      id: 1,
      name: "Medical CT Scans - Chest",
      description: "Collection of chest CT scans for lung disease analysis",
      author: "Dr. Linh Duong Tuan",
      version: "1.1",
      created_at: "2025-06-25T10:00:00Z"
    },
    {
      id: 2,
      name: "Medical Image Annotations",
      description: "Annotated regions of interest for machine learning training",
      author: "Research Team",
      version: "1.0",
      created_at: "2025-06-25T11:00:00Z"
    },
    {
      id: 3,
      name: "Lab Experiment Results",
      description: "Digital lab notebook data and experimental measurements",
      author: "Dr. Linh Duong Tuan",
      version: "2.0",
      created_at: "2025-06-25T12:00:00Z"
    }
  ]

  useEffect(() => {
    setMounted(true)
    setDatasets(mockDatasets)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  const filteredDatasets = datasets.filter(dataset =>
    dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dataset.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          📊 Research Data Portal
        </h2>
        
        {/* Search and Actions */}
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search datasets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <Upload size={20} />
            Upload Dataset
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            <Database size={20} />
            New Dataset
          </button>
        </div>
      </div>

      {/* Datasets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDatasets.map((dataset) => (
          <div
            key={dataset.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedDataset(dataset)}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {dataset.name}
              </h3>
              <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                v{dataset.version}
              </span>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              {dataset.description}
            </p>
            
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>{dataset.author}</span>
              <span>{new Date(dataset.created_at).toLocaleDateString()}</span>
            </div>
            
            <div className="mt-4 flex gap-2">
              <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-700">
                <Download size={16} />
                Download
              </button>
              <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-700">
                <GitBranch size={16} />
                Versions
              </button>
              <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-700">
                <Users size={16} />
                Share
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Dataset Details Modal */}
      {selectedDataset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedDataset.name}
              </h3>
              <button
                onClick={() => setSelectedDataset(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Description</h4>
                <p className="text-gray-600 dark:text-gray-300">{selectedDataset.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Author</h4>
                  <p className="text-gray-600 dark:text-gray-300">{selectedDataset.author}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Version</h4>
                  <p className="text-gray-600 dark:text-gray-300">{selectedDataset.version}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Created</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  {new Date(selectedDataset.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
