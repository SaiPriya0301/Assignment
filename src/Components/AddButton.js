import React from 'react'

export const AddButton= ({handleFileUpload}) => {
  return (
    <div className='w-[50%] text-center'>
    <input
    type="file"
    accept="audio/*"
    multiple
    onChange={handleFileUpload}
    style={{ display: 'none' }}
    
    id="hiddenFileInput"
  />
  <button onClick={() => document.getElementById('hiddenFileInput').click()} className="bg-cyan-700 text-white font-semibold py-2 px-4 rounded cursor-pointer inline-block hover:border-teal-900 border">
    Add File
  </button>
  </div>
  )
}
