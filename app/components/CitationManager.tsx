"use client"

import { useState, useRef, useEffect } from 'react'

interface Citation {
  id: string
  authors: string[]
  title: string
  journal: string
  year: number
  doi?: string
  url?: string
  type: 'article' | 'book' | 'conference' | 'preprint'
}

interface CitationManagerProps {
  citations: Citation[]
  style?: 'apa' | 'mla' | 'chicago' | 'harvard'
}

export default function CitationManager({ citations, style: initialStyle = 'apa' }: CitationManagerProps) {
  const [selectedCitations, setSelectedCitations] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [showBibliography, setShowBibliography] = useState(false)
  const [style, setStyle] = useState(initialStyle)

  const filteredCitations = citations.filter(citation => {
    const matchesSearch = citation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         citation.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         citation.journal.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === 'all' || citation.type === filterType
    
    return matchesSearch && matchesType
  })

  const formatCitation = (citation: Citation) => {
    const authorString = citation.authors.length > 1 
      ? `${citation.authors.slice(0, -1).join(', ')}, & ${citation.authors[citation.authors.length - 1]}`
      : citation.authors[0]

    switch (style) {
      case 'apa':
        return `${authorString} (${citation.year}). ${citation.title}. *${citation.journal}*.${citation.doi ? ` https://doi.org/${citation.doi}` : ''}`
      case 'mla':
        return `${citation.authors[0]}${citation.authors.length > 1 ? ', et al.' : ''}. "${citation.title}." *${citation.journal}*, ${citation.year}.`
      case 'chicago':
        return `${authorString}. "${citation.title}." *${citation.journal}* (${citation.year}).`
      case 'harvard':
        return `${authorString}, ${citation.year}. ${citation.title}. *${citation.journal}*.`
      default:
        return `${authorString} (${citation.year}). ${citation.title}. ${citation.journal}.`
    }
  }

  const toggleCitation = (citationId: string) => {
    setSelectedCitations(prev => 
      prev.includes(citationId) 
        ? prev.filter(id => id !== citationId)
        : [...prev, citationId]
    )
  }

  const copyBibliography = () => {
    const bibliography = selectedCitations
      .map(id => citations.find(c => c.id === id))
      .filter(Boolean)
      .map(citation => formatCitation(citation!))
      .join('\n\n')

    navigator.clipboard.writeText(bibliography)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold dark:text-white">Citation Manager</h3>
        <div className="flex space-x-2">
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="apa">APA</option>
            <option value="mla">MLA</option>
            <option value="chicago">Chicago</option>
            <option value="harvard">Harvard</option>
          </select>
          <button
            onClick={() => setShowBibliography(!showBibliography)}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            {showBibliography ? 'Hide' : 'Show'} Bibliography
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search citations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white"
        >
          <option value="all">All Types</option>
          <option value="article">Articles</option>
          <option value="book">Books</option>
          <option value="conference">Conference</option>
          <option value="preprint">Preprints</option>
        </select>
      </div>

      {/* Citations List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredCitations.map(citation => (
          <div
            key={citation.id}
            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
              selectedCitations.includes(citation.id)
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
            }`}
            onClick={() => toggleCitation(citation.id)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium dark:text-white text-sm">{citation.title}</h4>
                <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                  {citation.authors.join(', ')} • {citation.journal} • {citation.year}
                </p>
                {citation.doi && (
                  <a
                    href={`https://doi.org/${citation.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 text-xs hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    DOI: {citation.doi}
                  </a>
                )}
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                citation.type === 'article' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                citation.type === 'book' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                citation.type === 'conference' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
              }`}>
                {citation.type}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Citations Count */}
      {selectedCitations.length > 0 && (
        <div className="mt-4 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <span>{selectedCitations.length} citation(s) selected</span>
          <button
            onClick={copyBibliography}
            className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-xs"
          >
            Copy Bibliography
          </button>
        </div>
      )}

      {/* Bibliography Display */}
      {showBibliography && selectedCitations.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border">
          <h4 className="font-medium mb-3 dark:text-white">Bibliography ({style.toUpperCase()})</h4>
          <div className="space-y-3 text-sm">
            {selectedCitations
              .map(id => citations.find(c => c.id === id))
              .filter(Boolean)
              .map(citation => (
                <div key={citation!.id} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {formatCitation(citation!)}
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  )
}
