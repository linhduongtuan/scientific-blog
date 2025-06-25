"use client"

import React, { useState, useEffect } from 'react'
import { BookOpen, Plus, Calendar, User, Target, CheckCircle } from 'lucide-react'

interface Experiment {
  id: number
  title: string
  status: 'planned' | 'in_progress' | 'completed'
  researcher: string
  start_date: string
  objective: string
  progress: number
}

export default function DigitalLabNotebookOptimized() {
  const [mounted, setMounted] = useState(false)
  const [experiments, setExperiments] = useState<Experiment[]>([
    {
      id: 1,
      title: "CT Image Analysis - Lung Disease Detection",
      status: "completed",
      researcher: "Dr. Linh Duong Tuan",
      start_date: "2025-06-25",
      objective: "Analyze CT images to identify potential lung abnormalities",
      progress: 100
    },
    {
      id: 2,
      title: "Medical Image Annotation Training",
      status: "in_progress",
      researcher: "Research Team",
      start_date: "2025-06-24",
      objective: "Train machine learning models on annotated medical images",
      progress: 75
    },
    {
      id: 3,
      title: "DICOM Processing Pipeline",
      status: "planned",
      researcher: "Dr. Linh Duong Tuan",
      start_date: "2025-06-26",
      objective: "Develop automated DICOM processing workflow",
      progress: 0
    }
  ])
  
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planned': return <BookOpen size={16} />
      case 'in_progress': return <Target size={16} />
      case 'completed': return <CheckCircle size={16} />
      default: return <BookOpen size={16} />
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          📝 Digital Lab Notebook
        </h2>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          <Plus size={20} />
          New Experiment
        </button>
      </div>

      {/* Experiments List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {experiments.map((experiment) => (
          <div
            key={experiment.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedExperiment(experiment)}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {experiment.title}
              </h3>
              <span className={`text-sm px-2 py-1 rounded flex items-center gap-1 ${getStatusColor(experiment.status)}`}>
                {getStatusIcon(experiment.status)}
                {experiment.status.replace('_', ' ')}
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{experiment.researcher}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{new Date(experiment.start_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-start gap-2">
                <Target size={16} className="mt-0.5" />
                <span className="line-clamp-2">{experiment.objective}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Progress</span>
                <span className="text-gray-900 dark:text-white font-medium">{experiment.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${experiment.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Experiment Details Modal */}
      {selectedExperiment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-4xl w-full max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedExperiment.title}
              </h3>
              <button
                onClick={() => setSelectedExperiment(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Experiment Details</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Researcher:</span> {selectedExperiment.researcher}</p>
                    <p><span className="font-medium">Start Date:</span> {new Date(selectedExperiment.start_date).toLocaleDateString()}</p>
                    <p><span className="font-medium">Status:</span> {selectedExperiment.status.replace('_', ' ')}</p>
                    <p><span className="font-medium">Progress:</span> {selectedExperiment.progress}%</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Objective</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{selectedExperiment.objective}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Recent Log Entries</h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                      <p className="font-medium">Observation</p>
                      <p className="text-gray-600 dark:text-gray-300">Image analysis completed successfully with high accuracy...</p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                      <p className="font-medium">Procedure</p>
                      <p className="text-gray-600 dark:text-gray-300">Applied advanced annotation tools for region marking...</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Key Measurements</h4>
                  <div className="space-y-1 text-sm">
                    <p>• Image dimensions: 512 x 512 pixels</p>
                    <p>• Processing time: 2.3 seconds</p>
                    <p>• Accuracy score: 94.7%</p>
                    <p>• Annotations created: 15</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
