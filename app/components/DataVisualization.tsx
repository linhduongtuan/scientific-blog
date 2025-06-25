"use client"

import { useState, useEffect } from 'react'
import { Bar, Line, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

interface DataVisualizationProps {
  type: 'bar' | 'line' | 'pie'
  data: any
  title?: string
  width?: number
  height?: number
}

export default function DataVisualization({ 
  type, 
  data, 
  title, 
  width = 400, 
  height = 300 
}: DataVisualizationProps) {
  const [chartData, setChartData] = useState(null)

  useEffect(() => {
    // Process data based on type
    const processedData = {
      ...data,
      datasets: data.datasets?.map((dataset: any) => ({
        ...dataset,
        backgroundColor: dataset.backgroundColor || [
          'rgba(59, 130, 246, 0.6)',
          'rgba(16, 185, 129, 0.6)',
          'rgba(245, 158, 11, 0.6)',
          'rgba(239, 68, 68, 0.6)',
          'rgba(139, 92, 246, 0.6)',
        ],
        borderColor: dataset.borderColor || [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)',
        ],
        borderWidth: dataset.borderWidth || 1,
      }))
    }
    setChartData(processedData)
  }, [data])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
    },
    scales: type !== 'pie' ? {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.3)',
        },
      },
      x: {
        grid: {
          color: 'rgba(156, 163, 175, 0.3)',
        },
      },
    } : {},
  }

  if (!chartData) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg border"
        style={{ width, height }}
      >
        <div className="text-gray-500 dark:text-gray-400">Loading chart...</div>
      </div>
    )
  }

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <Bar data={chartData} options={options} />
      case 'line':
        return <Line data={chartData} options={options} />
      case 'pie':
        return <Pie data={chartData} options={options} />
      default:
        return <div>Unsupported chart type</div>
    }
  }

  return (
    <div className="w-full">
      <div 
        className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
        style={{ width, height }}
      >
        {renderChart()}
      </div>
    </div>
  )
}
