import { categories, groupJobsByCategory } from '../utils/jobUtils'

// Generate Telegram formatted summary text
export const generateTelegramText = (result) => {
  if (!result) return ''

  // Generate the summary text
  const currentDate = new Date()
  const weekNumber = Math.ceil(currentDate.getDate() / 7)
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  
  let text = `Latest Jobs at : ${currentDate.getDate()}th ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()} (${weekNumber}${weekNumber === 1 ? 'st' : weekNumber === 2 ? 'nd' : weekNumber === 3 ? 'rd' : 'th'} week)\n\n`

  // Use both new jobs and same jobs (all jobs from the new file)
  const allNewFileJobs = [...result.newJobs, ...result.sameJobs]
  const groupedJobs = groupJobsByCategory(allNewFileJobs)

  // Add categories in the specified order
  categories.forEach(category => {
    const jobs = groupedJobs.get(category) || []
    text += `✅ ${category}`
    
    // Add appropriate spacing based on category length
    const spacingLength = Math.max(1, 40 - category.length)
    text += ' '.repeat(spacingLength)
    
    text += `(${jobs.length}) Opening Jobs\n\n`
  })

  return text
}

// Generate detailed job listings for a specific category
export const generateDetailedJobListingsForCategory = (result, category) => {
  if (!result) return ''
  
  const allNewFileJobs = [...result.newJobs, ...result.sameJobs]
  const groupedJobs = groupJobsByCategory(allNewFileJobs)
  
  const jobs = groupedJobs.get(category) || []
  if (jobs.length === 0) return ''
  
  let detailedText = `✅ ${category} (${jobs.length} Opening Jobs)\n\n`
  
  jobs.forEach((job, index) => {
    const title = job['Title'] || 'Untitled Position'
    const company = job["Companies' Name"] || 'Unknown Company'
    // Make location optional and handle different possible column names
    const location = job['Location'] || job['Job Location'] || job['Work Location'] || 'Yangon, Myanmar'
    const jobId = job['ID']
    const urlTitle = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
    
    detailedText += `${title}\n`
    detailedText += `💼${company}\n`
    detailedText += `📍${location}\n`
    detailedText += `🌐အလုပ်လျှောက်ရန် https://www.myjobs.com.mm/job/${urlTitle}-${jobId}`
    
    if (index < jobs.length - 1) {
      detailedText += '\n\n'
    }
  })
  
  return detailedText
}

// Generate detailed job listings for all categories
export const generateDetailedJobListings = (result) => {
  if (!result) return ''
  
  const allNewFileJobs = [...result.newJobs, ...result.sameJobs]
  const groupedJobs = groupJobsByCategory(allNewFileJobs)
  
  // Filter categories that have jobs
  const categoriesWithJobs = categories.filter(cat => 
    groupedJobs.has(cat) && groupedJobs.get(cat).length > 0
  )
  
  let detailedText = ''
  
  categoriesWithJobs.forEach((category, categoryIndex) => {
    const jobs = groupedJobs.get(category) || []
    if (jobs.length > 0) {
      detailedText += `✅ ${category} (${jobs.length} Opening Jobs)\n\n`
      
      jobs.forEach((job, index) => {
        // Format job title
        const title = job['Title'] || 'Untitled Position'
        
        // Company name
        const company = job["Companies' Name"] || 'Unknown Company'
        
        // Location - if available
        const location = job['Location'] || 'Yangon, Myanmar'
        
        // Job ID for the URL
        const jobId = job['ID']
        
        // Create URL-friendly version of the title
        const urlTitle = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
        
        // Create the detailed job listing
        detailedText += `${title}\n`
        detailedText += `💼${company}\n`
        detailedText += `📍${location}\n`
        detailedText += `🌐အလုပ်လျှောက်ရန် https://www.myjobs.com.mm/job/${urlTitle}-${jobId}`
        
        // Add spacing between jobs (but not after the last job in a category)
        if (index < jobs.length - 1) {
          detailedText += '\n\n'
        }
      })
      
      // Add extra spacing between categories (but not after the last category)
      if (categoryIndex < categoriesWithJobs.length - 1) {
        detailedText += '\n\n\n'
      }
    }
  })
  
  return detailedText
}