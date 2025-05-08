import React, { useState } from 'react';

const TelegramPoster = ({ generatedText, result, generateDetailedJobListingsForCategory }) => {
  const [mainChannelId, setMainChannelId] = useState('@somethingyeahh');
  const [categoryChannelId, setCategoryChannelId] = useState('@Yes20192');
  const [isPosting, setIsPosting] = useState(false);
  const [postStatus, setPostStatus] = useState(null);
  const [isAutoPosting, setIsAutoPosting] = useState(false);
  const [autoPostProgress, setAutoPostProgress] = useState('');
  
  // Default channel IDs
  const defaultMainChannelId = '@somethingyeahh';
  const defaultCategoryChannelId = '@Yes20192';

  // Telegram channel links for each category
  const categoryLinks = {
    'Accounting, Auditing & Finance': 'https://t.me/test_myjobs/9',
    'Administrative': 'https://t.me/test_myjobs/10',
    'Architecture': 'https://t.me/test_myjobs/32',
    'Business Development & Management': 'https://t.me/test_myjobs/11',
    'Community & Social Services': 'https://t.me/test_myjobs/30',
    'Creative, Media & Design': 'https://t.me/test_myjobs/12',
    'Consulting & Strategy': 'https://t.me/test_myjobs/28',
    'Customer Service': 'https://t.me/test_myjobs/13',
    'Engineering & Technical': 'https://t.me/test_myjobs/15',
    'Healthcare & Pharmacy': 'https://t.me/test_myjobs/31',
    'Human Resources & Recruitment': 'https://t.me/test_myjobs/17',
    'Information Technology': 'https://t.me/test_myjobs/29',
    'Legal & Compliance': 'https://t.me/test_myjobs/35',
    'Logistics, Supply Chain & Procurement': 'https://t.me/test_myjobs/34',
    'Marketing, PR & Communications': 'https://t.me/test_myjobs/20',
    'Project & Product Management': 'https://t.me/test_myjobs/26',
    'Planning & Operations': 'https://t.me/test_myjobs/21',
    'Quality Control & Assurance': 'https://t.me/test_myjobs/39',
    'Research, Teaching & Training': 'https://t.me/test_myjobs/23'
  };

  const handlePostToTelegram = async (useDefaultChannel = false) => {
    // Use default channel if auto upload is clicked
    const targetChannelId = useDefaultChannel ? defaultMainChannelId : mainChannelId;

    if (!targetChannelId || !generatedText) {
      setPostStatus('Please provide a channel ID and generate text first');
      return;
    }

    try {
      setIsPosting(true);
      setPostStatus('Posting to Telegram...');

      // Use relative URL path instead of absolute URL
      const apiUrl = '/api/post-to-telegram';
      
      // Add console log for debugging
      console.log(`Using API URL: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          message: generatedText,
          channelId: targetChannelId,
          parseMode: 'Markdown' // Explicitly set parse mode
        }),
      });

      // Log response status for debugging
      console.log(`Response status: ${response.status}`);

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error response: ${errorText}`);
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setPostStatus(`Posted successfully to Telegram${useDefaultChannel ? ' (Auto Upload)' : ''}!`);
      } else {
        setPostStatus(`Failed to post: ${result.error}`);
      }
    } catch (error) {
      console.error('Telegram posting error:', error);
      setPostStatus(`Error: ${error.message}`);
    } finally {
      setIsPosting(false);
    }
  };

  // Generate main content with embedded links
  const generateMainContentWithLinks = () => {
    if (!result || !result.newJobs || !result.sameJobs) {
      return '';
    }

    const allJobs = [...result.newJobs, ...result.sameJobs];
    const groupedJobs = groupJobsByCategory(allJobs);
    
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.toLocaleString('en-US', { month: 'long' });
    const year = currentDate.getFullYear();
    const weekNumber = Math.ceil(day / 7);
    const weekSuffix = weekNumber === 1 ? 'st' : weekNumber === 2 ? 'nd' : weekNumber === 3 ? 'rd' : 'th';
    
    // Header content
    let headerContent = `🛄 အလုပ်အကိုင် အခွင့်အလမ်းသစ်များကို ရှာဖွေနေပါသလား? 🛄\n\n`;
    headerContent += `Myjobs Myanmar မှ တဆင့် မြန်မာနိုင်ငံတဝှမ်းလုံးရှိ လုပ်ငန်းရှင်များမှ မိတ်ဆွေတို့လို အရည်အချင်းပြည့်ဝတဲ့သူတွေကို ခန့်အပ်နိုင်ဖို့ ဝန်ထမ်းသစ်များကိုရှာဖွေနေပါတယ်။\n`;
    headerContent += `အောက်ဖော်ပြပါ Category များတွင် မိတ်ဆွေနဲ့ ကိုက်ညီတဲ့ အလုပ်တွေ ခေါ် ယူနေပါတယ်။ အခွင့်အလမ်းတွေ လက်မလွတ်သွားဖို့ အခုပဲ မိမိ စိတ်ဝင်စားတဲ့ Category ကို နှိပ်ပြီး လေ့လာလိုက်ပါ။ မိမိ ကြိုက်နှစ်သက်တဲ့ အလုပ်အကိုင်များကိုလည်း မိနစ်ပိုင်းနဲ့ အလွယ်တကူလျှောက်ထားနိုင်ပါတယ်။\n\n`;
    headerContent += `Latest Jobs at : ${day}${getDaySuffix(day)} ${month} ${year} (${weekNumber}${weekSuffix} week)\n`;
    
    // Categories content
    let categoriesContent = '';
    for (const category of Object.keys(categoryLinks)) {
      const simplifiedCategory = simplifyCategory(category);
      const jobCount = groupedJobs.has(category) ? groupedJobs.get(category).length : 0;
      
      // Skip categories with 0 jobs
      if (jobCount === 0) continue;
      
      const link = categoryLinks[category] || '';
      if (link) {
        categoriesContent += `\n✅ ${simplifiedCategory} \t\t[(${jobCount}) Opening Jobs](${link})\n`;
      } else {
        categoriesContent += `\n✅ ${simplifiedCategory} \t\t(${jobCount}) Opening Jobs\n`;
      }
    }
    
    // Footer content
    let footerContent = `\n\n📣 အကြံပြုချက် 📣\n`;
    footerContent += `မိတ်ဆွေရဲ့ အလုပ်လျှောက်လွှာ (CV) တွေဟာ သက်ဆိုင်ရာ လုပ်ငန်းရှင်များဆီ တိုက်ရိုက်ရောက်ရှိသွားမှာ ဖြစ်လို့ Update အဖြစ်ဆုံး CV ကို အသုံးပြုပြီး လျှောက်ထားပေးခြင်းဖြင့် အလုပ်အကိုင် ရရှိဖို့ အခွင့်အရေးပိုမိုရရှိစေပါတယ်။\n\n`;
    footerContent += `⚠️ အလုပ်လျှောက်ဖို့ အခက်အခဲဖြစ်နေပါလား? ⚠️\n`;
    footerContent += `𝗠𝘆𝗝𝗼𝗯𝘀 Myanmar Team ကို Facebook page messenger ကဖြစ်စေ၊ 09 880 141 136 နဲ့ 09 880 141 137 တိုကို ဆက်သွယ်မေးမြန်းနိုင်ပါတယ်။\n\n`;
    footerContent += `Up to Date အလုပ်အကိုင်များကြည့်ရှုဖို Register ပြုလုပ်ရန် > https://www.myjobs.com.mm/register\n\n`;
    footerContent += `MyJobs Myanmar - Telegram Channel https://t.me/myjobsmyanmartelegram\n\n`;
    footerContent += `MyJobs Myanmar - Viber Community Group https://shorturl.at/efhrI\n\n`;
    footerContent += `𝗨𝗻𝗹𝗼𝗰𝗸𝗶𝗻𝗴 𝗣𝗼𝘁𝗲𝗻𝘁𝗶𝗲𝗹𝘀 𝗞𝘀𝘁𝘀`;
    
    // Combine all content
    return headerContent + categoriesContent + footerContent;
  };

  // Helper function to get day suffix (1st, 2nd, 3rd, etc.)
  const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  // Helper function to simplify category names for display
  const simplifyCategory = (category) => {
    return category
      .replace('Accounting, Auditing & Finance', 'Accounting | Auditing | Finance')
      .replace('Business Development & Management', 'Sales | Business Development | Management')
      .replace('Community & Social Services', 'Community | Social Services')
      .replace('Creative, Media & Design', 'Creative | Media | Design')
      .replace('Consulting & Strategy', 'Consulting | Strategy')
      .replace('Engineering & Technical', 'Engineering | Technical')
      .replace('Healthcare & Pharmacy', 'Healthcare | Pharmacy')
      .replace('Human Resources & Recruitment', 'Human Resources | Recruitment')
      .replace('Legal & Compliance', 'Legal | Compliance')
      .replace('Logistics, Supply Chain & Procurement', 'Logistics | Supply Chain | Procurement')
      .replace('Marketing, PR & Communications', 'Marketing | PR | Communications')
      .replace('Project & Product Management', 'Project | Product Management')
      .replace('Planning & Operations', 'Planning | Operations')
      .replace('Research, Teaching & Training', 'Research | Teaching | Training');
  };

  // Handle posting only the main content with links
  const handlePostMainContent = async () => {
    if (!result || !mainChannelId) {
      setPostStatus('Please provide a main channel ID and generate job results first');
      return;
    }

    try {
      setIsPosting(true);
      setPostStatus('Posting main content to Telegram...');
      
      // Generate and post only the main content with links
      const mainContent = generateMainContentWithLinks();
      await postMessage(mainContent, mainChannelId);
      
      setPostStatus('Main content posted successfully to Telegram!');
    } catch (error) {
      setPostStatus(`Error: ${error.message}`);
    } finally {
      setIsPosting(false);
    }
  };

  // Handle posting only the individual category job listings
  const handlePostCategoryListings = async () => {
    if (!result || !categoryChannelId) {
      setPostStatus('Please provide a category channel ID and generate job results first');
      return;
    }

    try {
      setIsAutoPosting(true);
      setPostStatus('Starting to post individual category listings...');
      
      // Post each category with jobs > 0
      if (result.newJobs && result.sameJobs) {
        const allJobs = [...result.newJobs, ...result.sameJobs];
        const groupedJobs = groupJobsByCategory(allJobs);
        
        // Get categories with jobs
        const categoriesWithJobs = [];
        groupedJobs.forEach((jobs, category) => {
          if (jobs.length > 0) {
            categoriesWithJobs.push({
              category,
              count: jobs.length
            });
          }
        });
        
        // Track failed categories
        const failedCategories = [];
        
        // Post each category
        for (let i = 0; i < categoriesWithJobs.length; i++) {
          const { category, count } = categoriesWithJobs[i];
          setAutoPostProgress(`Posting ${category} (${count} jobs)... ${i+1}/${categoriesWithJobs.length}`);
          
          try {
            // Generate detailed listings for this category
            const categoryText = generateDetailedJobListingsForCategory(result, category);
            
            // Verify we have valid content and channelId before posting
            if (!categoryText || categoryText.trim() === '') {
              console.error(`Empty content generated for category: ${category}`);
              failedCategories.push(category);
              continue;
            }
            
            if (!categoryChannelId) {
              throw new Error('Category channel ID is missing or invalid');
            }
            
            // Post to Telegram using the category channel
            await postMessage(categoryText, categoryChannelId);
            
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (categoryError) {
            console.error(`Error posting category ${category}:`, categoryError);
            failedCategories.push(category);
            // Continue with next category instead of stopping the entire process
            continue;
          }
        }
        
        // Show status with failed categories if any
        if (failedCategories.length > 0) {
          setPostStatus(`Posting completed with ${failedCategories.length} failed categories: ${failedCategories.join(', ')}`);
        } else {
          setPostStatus('All category listings posted successfully!');
        }
        setAutoPostProgress('');
      }
    } catch (error) {
      setPostStatus(`Error during category posting process`);
    } finally {
      setIsAutoPosting(false);
    }
  };

  // Full automated posting process (both main content and categories)
  const handleFullAutomatedPosting = async () => {
    if (!result || !mainChannelId || !categoryChannelId) {
      setPostStatus('Please provide channel IDs and generate job results first');
      return;
    }

    try {
      setIsAutoPosting(true);
      setPostStatus('Starting fully automated posting process...');
      
      // Step 1: Post main content to main channel
      setAutoPostProgress('Posting main summary to main channel...');
      try {
        const mainContent = generateMainContentWithLinks();
        await postMessage(mainContent, mainChannelId);
      } catch (error) {
        console.error('Error posting main content:', error);
        setAutoPostProgress('Failed to post main content. Continuing with categories...');
      }
      
      // Step 2: Post individual categories to category channel
      setAutoPostProgress('Now posting individual category listings to category channel...');
      await handlePostCategoryListings();
      
    } catch (error) {
      setPostStatus(`Error during automated posting: ${error.message}`);
    } finally {
      setIsAutoPosting(false);
    }
  };
  
  // Helper function to post a message to Telegram
  const postMessage = async (message, channelId) => {
    if (!message || !channelId) {
      throw new Error('Message and channelId are required');
    }
    
    // Use environment-based API URL with the correct endpoint
    const apiBaseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://telegrampostmaker-production.up.railway.app'
      : 'http://localhost:3001';
    
    // Try both the /api path and root path
    const endpoints = [
      `${apiBaseUrl}/api/post-to-telegram`,
      `${apiBaseUrl}/post-to-telegram`,
      `${apiBaseUrl}`
    ];
    
    let lastError = null;
    
    // Try each endpoint until one works
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`);
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            message,
            channelId,
            parseMode: 'Markdown'
          }),
        });
        
        // Log response details for debugging
        console.log(`Response from ${endpoint}:`, response.status);
        
        // Check if response is ok before trying to parse JSON
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error from ${endpoint}:`, errorText);
          lastError = new Error(`Server responded with status: ${response.status}`);
          continue; // Try next endpoint
        }
        
        const result = await response.json();
        
        if (!result.success) {
          lastError = new Error(result.error || 'Failed to post message');
          continue; // Try next endpoint
        }
        
        return result; // Success! Return the result
      } catch (error) {
        console.error(`Error with endpoint ${endpoint}:`, error);
        lastError = error;
        // Continue to next endpoint
      }
    }
    
    // If we get here, all endpoints failed
    throw lastError || new Error('All API endpoints failed');
  };
  
  // Helper function to group jobs by category
  const groupJobsByCategory = (jobs) => {
    const groupedJobs = new Map();
    
    jobs.forEach(job => {
      let area = job['Functional Areas'];
      if (!area) area = 'Others';
      area = area.trim();
      
      // Find matching predefined category
      let matchingCategory = area;
      
      // Special case for Project & Product Management
      if (area === 'Project & Product Management') {
        matchingCategory = 'Project & Product Management';
      } else {
        for (const category of categories) {
          const areaParts = area.toLowerCase().split(/[|&,]/).map(part => part.trim());
          const categoryParts = category.toLowerCase().split(/[|&,]/).map(part => part.trim());
          
          const hasMatch = areaParts.some(areaPart => 
            categoryParts.some(catPart => 
              areaPart === catPart || 
              areaPart.includes(catPart) || 
              catPart.includes(areaPart)
            )
          );
          
          if (hasMatch) {
            matchingCategory = category;
            break;
          }
        }
      }

      if (!groupedJobs.has(matchingCategory)) {
        groupedJobs.set(matchingCategory, []);
      }
      groupedJobs.get(matchingCategory).push(job);
    });
    
    return groupedJobs;
  };
  
  // Predefined categories
  const categories = [
    'Accounting, Auditing & Finance',
    'Administrative',
    'Architecture',
    'Business Development & Management',
    'Creative, Media & Design',
    'Customer Service & Support',
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
    'Translation',
    'Community & Social Services',
    'Consulting & Strategy'
  ];

  return (
      <div className="mt-4 p-4 border rounded-lg bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Post to Telegram</h3>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Main Content Channel
          </label>
          <input
              type="text"
              value={mainChannelId}
              onChange={(e) => setMainChannelId(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="@somethingyeahh"
          />
          <p className="text-xs text-gray-500 mt-1">
            Channel for main content summary
          </p>
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category Listings Channel
          </label>
          <input
              type="text"
              value={categoryChannelId}
              onChange={(e) => setCategoryChannelId(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="@Yes20192"
          />
          <p className="text-xs text-gray-500 mt-1">
            Channel for individual job category listings
          </p>
        </div>

        <div className="flex gap-2 mb-2">
          <button
              onClick={handlePostMainContent}
              disabled={isPosting || isAutoPosting || !result}
              className={`flex-1 py-2 px-4 rounded-md ${
                  isPosting || isAutoPosting || !result
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
          >
            {isPosting ? 'Posting...' : 'Post Main Content'}
          </button>

          <button
              onClick={handlePostCategoryListings}
              disabled={isPosting || isAutoPosting || !result}
              className={`flex-1 py-2 px-4 rounded-md ${
                  isPosting || isAutoPosting || !result
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
          >
            {isPosting ? 'Posting...' : 'Post Job Categories'}
          </button>
        </div>

        <button
            onClick={handleFullAutomatedPosting}
            disabled={isPosting || isAutoPosting || !result}
            className={`w-full py-2 px-4 rounded-md ${
                isPosting || isAutoPosting || !result
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
        >
          {isAutoPosting ? 'Posting All Content...' : 'Fully Automated Posting'}
        </button>

        {autoPostProgress && (
            <div className="mt-2 p-2 rounded text-sm bg-blue-100 text-blue-800">
              {autoPostProgress}
            </div>
        )}

        {postStatus && (
            <div className={`mt-2 p-2 rounded text-sm ${
                postStatus.includes('success') || postStatus.includes('posted successfully')
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
            }`}>
              {postStatus}
            </div>
        )}
      </div>
  );
};

export default TelegramPoster;