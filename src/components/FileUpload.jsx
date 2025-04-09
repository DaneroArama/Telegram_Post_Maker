import React from 'react'

function FileUpload({ fileType, file, onFileChange }) {
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      onFileChange(file)
    }
  }

  const label = fileType === 'old' 
    ? 'Old File (Previous Jobs)' 
    : 'New File (Current Jobs)'

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={handleFileUpload}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {file && <p className="mt-1 text-sm text-gray-500">{file.name}</p>}
    </div>
  )
}

export default FileUpload