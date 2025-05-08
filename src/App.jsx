import { useState } from 'react'
import * as XLSX from 'xlsx'
import './App.css'

// Import components
import FileUpload from './components/FileUpload'
import JobList from './components/JobList'
import CategoryTabs from './components/CategoryTabs'
import TelegramPoster from './components/TelegramPoster'

// Import utilities and services
import { categories, getJobKey, parseExcelFile, groupJobsByCategory } from './utils/jobUtils'
import { generateTelegramText, generateDetailedJobListings, generateDetailedJobListingsForCategory } from './services/textGenerator'

function App() {
  const [oldFile, setOldFile] = useState(null)
  const [newFile, setNewFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState(null)

  // Compare job data and categorize
  const compareJobs = async () => {
    if (!oldFile || !newFile) {
      setError('Please upload both files')
      return
    }

    setLoading(true)
    setError('')

    try {
      const oldJobs = await parseExcelFile(oldFile, XLSX)
      const newJobs = await parseExcelFile(newFile, XLSX)

      // Create maps for faster lookup
      const oldJobsMap = new Map()
      oldJobs.forEach(job => {
        oldJobsMap.set(getJobKey(job), job)
      })

      const newJobsMap = new Map()
      newJobs.forEach(job => {
        newJobsMap.set(getJobKey(job), job)
      })

      // Categorize jobs
      const newJobsList = []
      const sameJobsList = []
      const expiredJobsList = []

      // Find new and same jobs
      newJobs.forEach(job => {
        const key = getJobKey(job)
        if (oldJobsMap.has(key)) {
          sameJobsList.push(job)
        } else {
          newJobsList.push(job)
        }
      })

      // Find expired jobs
      oldJobs.forEach(job => {
        const key = getJobKey(job)
        if (!newJobsMap.has(key)) {
          expiredJobsList.push(job)
        }
      })

      setResult({
        newJobs: newJobsList,
        sameJobs: sameJobsList,
        expiredJobs: expiredJobsList
      })
      
      // Set active tab after results are available
      setTimeout(() => {
        const allJobs = [...newJobsList, ...sameJobsList]
        const groupedJobs = groupJobsByCategory(allJobs)
        const categoriesWithJobs = categories.filter(cat => 
          groupedJobs.has(cat) && groupedJobs.get(cat).length > 0
        )
        
        if (categoriesWithJobs.length > 0) {
          setActiveTab(categoriesWithJobs[0])
        }
      }, 0)
      
    } catch (error) {
      setError(error.toString())
    } finally {
      setLoading(false)
    }
  }

  // Copy text to clipboard
  const copyToClipboard = () => {
    const text = generateTelegramText(result)
    navigator.clipboard.writeText(text)
      .then(() => alert('Copied to clipboard!'))
      .catch(err => console.error('Failed to copy: ', err))
  }

  // Copy detailed listings for a specific category to clipboard
  const copyDetailedListingsForCategory = (category) => {
    const text = generateDetailedJobListingsForCategory(result, category)
    navigator.clipboard.writeText(text)
      .then(() => alert(`Copied ${category} listings to clipboard!`))
      .catch(err => console.error('Failed to copy: ', err))
  }

  // Copy detailed listings to clipboard
  const copyDetailedListings = () => {
    const text = generateDetailedJobListings(result)
    navigator.clipboard.writeText(text)
      .then(() => alert('Detailed listings copied to clipboard!'))
      .catch(err => console.error('Failed to copy: ', err))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Telegram Job Post Comparison</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <FileUpload 
            fileType="old" 
            file={oldFile} 
            onFileChange={setOldFile} 
          />
          
          <FileUpload 
            fileType="new" 
            file={newFile} 
            onFileChange={setNewFile} 
          />
        </div>
        
        <div className="flex justify-center mb-6">
          <button
            onClick={compareJobs}
            disabled={!oldFile || !newFile || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Compare Files'}
          </button>
        </div>
        
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        
        {result && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Results</h2>
              <div className="space-x-2">
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Copy Summary
                </button>
                <button
                  onClick={copyDetailedListings}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Copy All Listings
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <JobList jobs={result.newJobs} type="new" />
              <JobList jobs={result.sameJobs} type="same" />
              <JobList jobs={result.expiredJobs} type="expired" />
            </div>
            
            <div className="mt-6 p-4 bg-gray-100 rounded-md">
              <h3 className="text-lg font-medium mb-2">Telegram Format Preview:</h3>
              <pre className="whitespace-pre-wrap bg-white p-3 rounded border border-gray-300 text-sm">
                {generateTelegramText(result)}
              </pre>
            </div>
            
            <div className="mt-6 p-4 bg-gray-100 rounded-md">
              <h3 className="text-lg font-medium mb-2">Detailed Listings Preview:</h3>
              {result && (() => {
                const allNewFileJobs = [...result.newJobs, ...result.sameJobs]
                const groupedJobs = groupJobsByCategory(allNewFileJobs)
                
                return (
                  <>
                    <CategoryTabs 
                      categories={categories}
                      groupedJobs={groupedJobs}
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      onCopyCategory={copyDetailedListingsForCategory}
                      newJobs={result.newJobs}
                    />
                    
                    {/* Add TelegramPoster for active category */}
                    {activeTab && (
                      <div className="mt-4">
                        <TelegramPoster 
                          generatedText={generateTelegramText(result)} 
                          result={result}
                          generateDetailedJobListingsForCategory={generateDetailedJobListingsForCategory}
                        />
                      </div>
                    )}
                  </>
                )
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
