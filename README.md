# Telegram Job Post Maker

A React application that helps compare job listings from Excel files and formats them for posting on Telegram. This tool streamlines the process of identifying new, unchanged, and expired job listings, and generates properly formatted text for Telegram posts.

## Features

- **File Comparison**: Upload and compare old and new Excel files containing job listings
- **Job Categorization**: Automatically categorizes jobs as new, unchanged, or expired
- **Category Organization**: Groups jobs by functional areas into predefined categories
- **Telegram Formatting**: Generates properly formatted text for Telegram posts
- **Detailed Job Listings**: Creates detailed job listings with company, location, and application links
- **Category-based Copying**: Copy all jobs or specific categories to clipboard
- **Interactive UI**: Tab-based interface for browsing jobs by category

## Tech Stack

- **Frontend Framework**: React with Hooks
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Excel Processing**: xlsx library
- **State Management**: React useState hooks
- **UI Components**: Custom components with Tailwind styling
- **File Handling**: FileReader API
- **Clipboard Integration**: Clipboard API

## Project Structure

The application is organized into the following components:

- **App.jsx**: Main application component
- **Components**:
  - FileUpload: Handles file selection and upload
  - JobList: Displays job listings by category
  - JobCard: Individual job display component
  - CategoryTabs: Tab-based navigation for job categories
- **Utils**:
  - jobUtils.js: Utility functions for job data processing
- **Services**:
  - textGenerator.js: Functions for generating formatted text

## Key Methods

- **compareJobs()**: Compares old and new job files to identify changes
- **groupJobsByCategory()**: Organizes jobs into predefined categories
- **generateTelegramText()**: Creates summary text for Telegram posts
- **generateDetailedJobListings()**: Creates detailed job listings for all categories
- **generateDetailedJobListingsForCategory()**: Creates detailed listings for a specific category
- **copyToClipboard()**: Copies generated text to clipboard
- **copyDetailedListingsForCategory()**: Copies listings for a specific category
- **copyAllCategoriesSeparately()**: Sequentially copies each category's listings

## How to Use

1. Upload an old Excel file containing previous job listings
2. Upload a new Excel file containing current job listings
3. Click "Compare Files" to analyze the differences
4. View the categorized results (new, same, expired jobs)
5. Use the copy buttons to copy formatted text to clipboard:
   - "Copy Summary" for a category overview
   - "Copy All Listings" for detailed listings of all jobs
   - "Copy This Category" to copy only the currently selected category

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```
