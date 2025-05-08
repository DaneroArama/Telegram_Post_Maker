// Categories and utility functions for job processing

// Predefined categories in the desired order
export const categories = [
  'Accounting, Auditing & Finance',
  'Administrative',
  'Architecture',
  'Business Development & Management',
  'Creative, Media & Design',
  'Customer Service & Support',
    'Community & Social Services',
  'Distribution & Warehousing',
  'Engineering & Technical',
  'Farming & Livestocking',
  'Food Services & Catering',
  'Healthcare & Pharmacy',
  'Hospitality & Leisure, Tourism',
  'Human Resources & Recruitment',
  'Information Technology',
  'Legal & Compliance',
  'Logistics, Supply Chain & Procurement',
  'Marketing, PR & Communications',
  'Planning & Operations',
  'Project & Product Management',
  'Quality Control & Assurance',
  'Research, Teaching & Training',
  'Translation'
]

// Generate unique key for each job
export const getJobKey = (job) => {
  return job['ID'].toString()
}

// Helper function to group jobs by category
export const groupJobsByCategory = (jobs) => {
  const groupedJobs = new Map()
  
  jobs.forEach(job => {
    let area = job['Functional Areas']
    if (!area) area = 'Others'
    area = area.trim()
    
    // Find matching predefined category
    let matchingCategory = area
    
    // Special case for Project & Product Management
    if (area === 'Project & Product Management') {
      matchingCategory = 'Project & Product Management'
    } else {
      for (const category of categories) {
        const areaParts = area.toLowerCase().split(/[|&,]/).map(part => part.trim())
        const categoryParts = category.toLowerCase().split(/[|&,]/).map(part => part.trim())
        
        const hasMatch = areaParts.some(areaPart => 
          categoryParts.some(catPart => 
            areaPart === catPart || 
            areaPart.includes(catPart) || 
            catPart.includes(areaPart)
          )
        )
        
        if (hasMatch) {
          matchingCategory = category
          break
        }
      }
    }

    if (!groupedJobs.has(matchingCategory)) {
      groupedJobs.set(matchingCategory, [])
    }
    groupedJobs.get(matchingCategory).push(job)
  })
  
  return groupedJobs
}

// Format job for display in UI
export const formatJobForDisplay = (job) => {
  const title = job['Title'] || 'Untitled Position'
  const company = job["Companies' Name"] || 'Unknown Company'
  const location = job['Location'] || job['Job Location'] || job['Work Location'] || 'Yangon, Myanmar'
  const jobId = job['ID']
  const urlTitle = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
  
  return {
    title,
    company,
    location,
    jobId,
    urlTitle
  }
}

// Parse Excel file and extract job data
export const parseExcelFile = (file, XLSX) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)
        resolve(jsonData)
      } catch (error) {
        reject('Error parsing file: ' + error.message)
      }
    }
    reader.onerror = () => reject('Error reading file')
    reader.readAsArrayBuffer(file)
  })
}