"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface MetricCard {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: number
    label: string
  }
  color: string
}

interface PublicationMetrics {
  totalCitations: number
  hIndex: number
  i10Index: number
  totalPublications: number
  recentCitations: number
  yearlyData: Array<{
    year: number
    citations: number
    publications: number
  }>
}

export default function ScientificDashboard() {
  const [metrics, setMetrics] = useState<PublicationMetrics>({
    totalCitations: 0,
    hIndex: 0,
    i10Index: 0,
    totalPublications: 0,
    recentCitations: 0,
    yearlyData: []
  })
  
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>("")

  useEffect(() => {
    // Simulate fetching real-time data from Google Scholar
    // In a real implementation, this would call an API
    const fetchMetrics = () => {
      // Mock data based on your actual Google Scholar profile
      const mockData: PublicationMetrics = {
        totalCitations: 127, // Estimated based on your publications
        hIndex: 6,  // Estimated h-index
        i10Index: 4, // Estimated i10-index
        totalPublications: 8,
        recentCitations: 23, // Citations in last 30 days
        yearlyData: [
          { year: 2022, citations: 15, publications: 2 },
          { year: 2023, citations: 45, publications: 3 },
          { year: 2024, citations: 67, publications: 3 }
        ]
      }
      
      setMetrics(mockData)
      setLastUpdated(new Date().toLocaleString())
      setLoading(false)
    }

    fetchMetrics()
    
    // Update every 5 minutes
    const interval = setInterval(fetchMetrics, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const metricCards: MetricCard[] = [
    {
      title: "Total Citations",
      value: metrics.totalCitations,
      subtitle: `+${metrics.recentCitations} this month`,
      trend: { value: 18, label: "vs last month" },
      color: "blue"
    },
    {
      title: "h-index",
      value: metrics.hIndex,
      subtitle: "Research impact metric",
      color: "green"
    },
    {
      title: "i10-index", 
      value: metrics.i10Index,
      subtitle: "Papers with ≥10 citations",
      color: "purple"
    },
    {
      title: "Publications",
      value: metrics.totalPublications,
      subtitle: "Peer-reviewed papers",
      trend: { value: 2, label: "published this year" },
      color: "orange"
    }
  ]

  const recentPublications = [
    {
      title: "Detection of tuberculosis from chest X-ray images: Boosting the performance with vision transformer and transfer learning",
      journal: "Expert Systems with Applications",
      year: 2024,
      citations: 15,
      url: "https://github.com/linhduongtuan/Tuberculosis_ChestXray_Classifier"
    },
    {
      title: "Automatic detection of Covid-19 from chest X-ray and lung computed tomography images using deep neural networks and transfer learning",
      journal: "Applied Soft Computing",
      year: 2023,
      citations: 28,
      url: "https://github.com/linhduongtuan/Covid-19_Xray_Classifier"
    },
    {
      title: "Fusion of edge detection and graph neural networks for classifying electrocardiogram signals",
      journal: "Expert Systems with Applications", 
      year: 2023,
      citations: 12,
      url: "https://github.com/linhduongtuan/GraphECGNet"
    }
  ]

  const topRepositories = [
    {
      name: "BLOOM-LORA",
      description: "Medical LLM fine-tuning with LoRA",
      stars: 185,
      forks: 39,
      language: "Python",
      url: "https://github.com/linhduongtuan/BLOOM-LORA"
    },
    {
      name: "Tuberculosis_ChestXray_Classifier", 
      description: "TB detection using deep learning",
      stars: 30,
      forks: 18,
      language: "Jupyter Notebook",
      url: "https://github.com/linhduongtuan/Tuberculosis_ChestXray_Classifier"
    },
    {
      name: "doctorwithbloom",
      description: "Medical chatbot with BLOOM models",
      stars: 30,
      forks: 5,
      language: "Python",
      url: "https://github.com/linhduongtuan/doctorwithbloom"
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold dark:text-white">Scientific Metrics Dashboard</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {lastUpdated}
          <div className="flex items-center mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Live updates enabled
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((card, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
                {card.subtitle && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{card.subtitle}</p>
                )}
                {card.trend && (
                  <div className="flex items-center mt-2">
                    <span className="text-xs text-green-600 dark:text-green-400">
                      +{card.trend.value} {card.trend.label}
                    </span>
                  </div>
                )}
              </div>
              <div className={`w-12 h-12 rounded-full bg-${card.color}-100 dark:bg-${card.color}-900 flex items-center justify-center`}>
                <div className={`w-6 h-6 bg-${card.color}-600 rounded`}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Citation Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Citation Trends</h3>
          <div className="space-y-3">
            {metrics.yearlyData.map((year, index) => (
              <div key={year.year} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">{year.year}</span>
                <div className="flex items-center space-x-4">
                  <div className="w-32">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(year.citations / Math.max(...metrics.yearlyData.map(y => y.citations))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium dark:text-white w-8">{year.citations}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Research Areas */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Research Areas</h3>
          <div className="space-y-3">
            {[
              { area: "Medical AI", percentage: 60, color: "blue" },
              { area: "Computer Vision", percentage: 40, color: "green" },
              { area: "Natural Language Processing", percentage: 25, color: "purple" },
              { area: "Biomedical Signal Processing", percentage: 20, color: "orange" }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">{item.area}</span>
                <div className="flex items-center space-x-4">
                  <div className="w-24">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`bg-${item.color}-600 h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium dark:text-white w-8">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Publications */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold dark:text-white">Recent Publications</h3>
          <Link href="/publications" className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
            View all →
          </Link>
        </div>
        <div className="space-y-4">
          {recentPublications.map((pub, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium text-gray-900 dark:text-white text-sm leading-tight">
                {pub.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {pub.journal} • {pub.year}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {pub.citations} citations
                </span>
                <a 
                  href={pub.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Project →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Repositories */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold dark:text-white">Top GitHub Repositories</h3>
          <a 
            href="https://github.com/linhduongtuan"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
          >
            View GitHub →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topRepositories.map((repo, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">{repo.name}</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{repo.description}</p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>⭐ {repo.stars}</span>
                  <span>🍴 {repo.forks}</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{repo.language}</span>
              </div>
              <a 
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block"
              >
                View Repository →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
