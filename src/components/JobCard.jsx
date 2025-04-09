import React from 'react'

function JobCard({ job }) {
  const title = job['Title'] || 'Untitled Position'
  const company = job["Companies' Name"] || 'Unknown Company'
  // Make location optional and handle different possible column names
  const location = job['Location'] || 'Yangon, Myanmar'
  const jobId = job['ID']
  const urlTitle = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
  
  return (
    <div className="mb-4 pb-4 border-b last:border-b-0">
      <div className="font-medium">{title}</div>
      <div>💼 {company}</div>
      <div>📍 {location}</div>
      <div>🌐 <a 
        href={`https://www.myjobs.com.mm/job/${urlTitle}-${jobId}`}
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-blue-600 hover:underline"
      >
        အလုပ်လျှောက်ရန် https://www.myjobs.com.mm/job/{urlTitle}-{jobId}
      </a></div>
    </div>
  )
}

export default JobCard