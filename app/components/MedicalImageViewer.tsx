
"use client"

import React, { useState, useRef, useCallback } from 'react'
import { Upload, Download, Ruler, Square, Type, GitCompare } from 'lucide-react'

interface MedicalImageViewerProps {
  onImageLoadAction?: (imageData: any) => void
  onAnnotationChangeAction?: (annotations: any[]) => void
}

export default function MedicalImageViewer({ onImageLoadAction, onAnnotationChangeAction }: MedicalImageViewerProps) {
  const [image, setImage] = useState<string | null>(null)
  const [annotations, setAnnotations] = useState<any[]>([])
  const [currentTool, setCurrentTool] = useState<'measurement' | 'roi' | 'text' | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPoint, setStartPoint] = useState<{x: number, y: number} | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check if it's a DICOM file
      if (file.name.toLowerCase().endsWith('.dcm')) {
        // In a real implementation, you would use a DICOM parser like cornerstone.js
        console.log('DICOM file detected:', file.name)
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        setImage(imageData)
        onImageLoadAction?.(imageData)
      }
      reader.readAsDataURL(file)
    }
  }, [onImageLoadAction])

  const handleCanvasMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!currentTool) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    setIsDrawing(true)
    setStartPoint({ x, y })
  }, [currentTool])

  const handleCanvasMouseUp = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint || !currentTool) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const endX = event.clientX - rect.left
    const endY = event.clientY - rect.top

    const newAnnotation = {
      id: Date.now(),
      type: currentTool,
      startPoint,
      endPoint: { x: endX, y: endY },
      timestamp: new Date().toISOString()
    }

    const updatedAnnotations = [...annotations, newAnnotation]
    setAnnotations(updatedAnnotations)
    onAnnotationChangeAction?.(updatedAnnotations)

    setIsDrawing(false)
    setStartPoint(null)
    setCurrentTool(null)
  }, [isDrawing, startPoint, currentTool, annotations, onAnnotationChangeAction])

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
            <GitCompare size={20} />
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
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 cursor-crosshair"
              onMouseDown={handleCanvasMouseDown}
              onMouseUp={handleCanvasMouseUp}
              style={{
                width: imageRef.current?.clientWidth || 0,
                height: imageRef.current?.clientHeight || 0
              }}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            Upload a medical image to begin analysis
          </div>
        )}
      </div>

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
