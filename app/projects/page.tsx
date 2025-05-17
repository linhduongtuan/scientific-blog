"use client"

import Link from 'next/link'
import { useState } from 'react'
import { PROJECTS } from '@/app/data/projects'

// Function to get all unique technologies from projects
const getAllTechnologies = () => {
  const techSet = new Set<string>()
  PROJECTS.forEach(project => {
    project.technologies.forEach(tech => techSet.add(tech))
  })
  return Array.from(techSet).sort()
}

// Function to get all unique categories
const getAllCategories = () => {
  const categories = new Set<string>()
  PROJECTS.forEach(project => {
    categories.add(project.category)
  })
  return Array.from(categories).sort()
}

export default function Projects() {
  const [selectedTech, setSelectedTech] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedProject, setExpandedProject] = useState<string | null>(null)
  
  const allTechnologies = getAllTechnologies()
  const allCategories = getAllCategories()
  
  // Filter projects based on selected technology and category
  const filteredProjects = PROJECTS.filter(project => {
    const matchesTech = selectedTech ? project.technologies.includes(selectedTech) : true
    const matchesCategory = selectedCategory ? project.category === selectedCategory : true
    return matchesTech && matchesCategory
  })

  // Format date from YYYY-MM to Month YYYY
  const formatDate = (dateString: string) => {
    const [year, month] = dateString.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  // Toggle project expansion
  const toggleProject = (id: string) => {
    if (expandedProject === id) {
      setExpandedProject(null)
    } else {
      setExpandedProject(id)
    }
  }

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 dark:text-white">Projects</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          A collection of my research projects and software development work in scientific computing,
          machine learning, and data visualization.
          <span className="text-sm text-gray-500 dark:text-gray-400 block mt-2">
            Last updated: 2025-05-17 by linhduongtuan
          </span>
        </p>
      </div>
      
      {/* Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="w-full md:w-auto">
            <label className="text-gray-700 dark:text-gray-300 font-medium block md:inline mr-2">Category:</label>
            <select
              className="w-full md:w-64 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              value={selectedCategory || ""}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
            >
              <option value="">All Categories</option>
              {allCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-auto">
            <label className="text-gray-700 dark:text-gray-300 font-medium block md:inline mr-2">Technology:</label>
            <select
              className="w-full md:w-64 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              value={selectedTech || ""}
              onChange={(e) => setSelectedTech(e.target.value || null)}
            >
              <option value="">All Technologies</option>
              {allTechnologies.map(tech => (
                <option key={tech} value={tech}>{tech}</option>
              ))}
            </select>
          </div>
          
          {(selectedCategory || selectedTech) && (
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedTech(null);
              }}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
      
      {/* Projects Grid */}
      <div className="space-y-8">
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
            <div key={project.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-gray-800">
              {/* Project Image */}
              <div className="relative w-full h-48 bg-gradient-to-r from-blue-500 to-purple-600">
                <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold">
                  {project.title}
                </div>
              </div>
              
              {/* Project Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full mb-2">
                      {project.category}
                    </span>
                    <h2 className="text-2xl font-bold dark:text-white">{project.title}</h2>
                  </div>
                  <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(project.startDate)}
                    {project.endDate ? ` - ${formatDate(project.endDate)}` : " - Present"}
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {expandedProject === project.id 
                    ? project.longDescription 
                    : project.description}
                </p>
                
                <button 
                  onClick={() => toggleProject(project.id)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm mb-4"
                >
                  {expandedProject === project.id ? "Show Less" : "Read More"}
                </button>
                
                {/* Achievements */}
                {expandedProject === project.id && project.achievements && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 dark:text-white">Key Achievements</h3>
                    <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
                      {project.achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Collaborators */}
                {expandedProject === project.id && project.collaborators && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 dark:text-white">Collaborators</h3>
                    <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
                      {project.collaborators.map((collaborator, index) => (
                        <li key={index}>{collaborator}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Technologies */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map(tech => (
                      <span 
                        key={tech} 
                        className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                          selectedTech === tech
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                        onClick={() => setSelectedTech(tech === selectedTech ? null : tech)}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Links */}
                <div className="flex gap-4">
                  {project.githubUrl && (
                    <a 
                      href={project.githubUrl} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                      GitHub Repository
                    </a>
                  )}
                  
                  {project.demoUrl && (
                    <a 
                      href={project.demoUrl} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No projects found matching the selected criteria.</p>
            <button
              onClick={() => {
                setSelectedTech(null);
                setSelectedCategory(null);
              }}
              className="mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}