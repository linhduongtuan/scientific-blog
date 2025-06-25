"use client"

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Upload, Ruler, Square, Type, Diff } from 'lucide-react'

interface MedicalImageViewerProps {
  onImageLoadAction?: (imageData: any) => void
  onAnnotationChangeAction?: (annotations: any[]) => void
}

export default function MedicalImageViewerOptimized({ onImageLoadAction, onAnnotationChangeAction }: MedicalImageViewerProps) {
  const [mounted, setMounted] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const [annotations, setAnnotations] = useState<any[]>([])
  const [currentTool, setCurrentTool] = useState<'measurement' | 'roi' | 'text' | null>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        setImage(imageData)
        onImageLoadAction?.(imageData)
      }
      reader.readAsDataURL(file)
    }
  }, [onImageLoadAction])

  if (!mounted) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          🔬 Medical Image Viewer
        </h2>
        
        {/* Toolbar */}
        <div className="flex flex-wrap gap-4 items-center">
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer">
            <Upload size={20} />
            Upload DICOM/Image
            <input
              type="file"
              accept=".dcm,.jpg,.jpeg,.png"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          
          <button
            onClick={() => setCurrentTool(currentTool === 'measurement' ? null : 'measurement')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              currentTool === 'measurement'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Ruler size={20} />
            Measure
          </button>
          
          <button
            onClick={() => setCurrentTool(currentTool === 'roi' ? null : 'roi')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              currentTool === 'roi'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Square size={20} />
            ROI
          </button>
          
          <button
            onClick={() => setCurrentTool(currentTool === 'text' ? null : 'text')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              currentTool === 'text'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Type size={20} />
            Annotate
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg">
            <Diff size={20} />
            Compare
          </button>
        </div>
      </div>

      {/* Image Display Area */}
      <div className="relative border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
        {image ? (
          <div className="relative">
            <img
              ref={imageRef}
              src={image}
              alt="Medical Image"
              className="max-w-full h-auto"
              style={{ maxHeight: '600px' }}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            Upload a medical image to begin analysis
          </div>
        )}
      </div>

      {/* Status */}
      {currentTool && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {currentTool === 'measurement' && 'Click and drag to measure distances'}
            {currentTool === 'roi' && 'Click and drag to define regions of interest'}
            {currentTool === 'text' && 'Click to add text annotations'}
          </p>
        </div>
      )}

      {/* Annotations Panel */}
      {annotations.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Annotations ({annotations.length})
          </h3>
          <div className="space-y-2">
            {annotations.map((annotation, index) => (
              <div
                key={annotation.id}
                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {annotation.type.charAt(0).toUpperCase() + annotation.type.slice(1)} #{index + 1}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(annotation.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
