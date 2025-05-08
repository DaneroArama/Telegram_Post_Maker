import React from 'react'
import JobCard from './JobCard'

function CategoryTabs({ categories, groupedJobs, activeTab, setActiveTab, onCopyCategory, newJobs = [] }) {
  // Filter categories that have jobs
  const categoriesWithJobs = categories.filter(cat => 
    groupedJobs.has(cat) && groupedJobs.get(cat).length > 0
  )

  // Helper function to check if a job is new
  const isJobNew = (job) => {
    return newJobs.some(newJob => newJob['ID'] === job['ID'])
  }

  return (
    <div>
      {/* Tab navigation */}
      <div className="flex flex-wrap gap-2 mb-4 border-b">
        {categoriesWithJobs.map(category => (
          <button
            key={category}
            className={`px-3 py-2 text-sm font-medium rounded-t-lg ${
              activeTab === category 
                ? 'bg-white border border-b-0 border-gray-300 text-blue-600' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
            onClick={() => setActiveTab(category)}
          >
            {category} ({groupedJobs.get(category).length})
          </button>
        ))}
      </div>
      
      {/* Tab content */}
      <div className="bg-white p-4 border border-gray-300 rounded-b-lg min-h-[300px] max-h-[500px] overflow-y-auto">
        {activeTab && (
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">{activeTab} ({groupedJobs.get(activeTab).length})</h3>
            <button
              onClick={() => onCopyCategory(activeTab)}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Copy This Category
            </button>
          </div>
        )}
        {activeTab && groupedJobs.get(activeTab)?.map(job => (
          <JobCard key={job['ID']} job={job} isNew={isJobNew(job)} />
        ))}
      </div>
    </div>
  )
}

export default CategoryTabs