import React from 'react'
import { getJobKey } from '../utils/jobUtils'

function JobList({ jobs, type }) {
  const formatJob = (job) => {
    return (
      <div key={getJobKey(job)} className="mb-2 p-2 border border-gray-200 rounded">
        <div className="font-bold">{job['Title']}</div>
        <div className="text-sm">ID: {job['ID']}</div>
        <div>{job["Companies' Name"]}</div>
        <div className="text-sm text-gray-600">
          <div>Expiry Date: {job['Expiry Date']}</div>
          <div>Created At: {job['Created At']}</div>
          {job['Functional Areas'] && <div>Area: {job['Functional Areas']}</div>}
        </div>
      </div>
    )
  }

  let title = ''
  let icon = ''
  let bgColor = ''

  switch (type) {
    case 'new':
      title = 'New Jobs'
      icon = '✅'
      bgColor = 'bg-green-100'
      break
    case 'same':
      title = 'Same Jobs'
      icon = '🔁'
      bgColor = 'bg-gray-100'
      break
    case 'expired':
      title = 'Expired Jobs'
      icon = '❌'
      bgColor = 'bg-red-100'
      break
    default:
      title = 'Jobs'
      bgColor = 'bg-white'
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-2 flex items-center">
        <span className="mr-2">{icon}</span> {title} ({jobs.length})
      </h3>
      <div className={`border border-gray-200 rounded-md p-3 ${bgColor} max-h-[80vh] overflow-y-auto`}>
        {jobs.length > 0 ? (
          jobs.map(job => formatJob(job))
        ) : (
          <p className="text-gray-500 text-sm">No {type} jobs found</p>
        )}
      </div>
    </div>
  )
}

export default JobList