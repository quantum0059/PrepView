import React from 'react'

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center min-h-screen min-w-screen overflow-hidden bg-[#020408]">
      <div className="three-body">
        <div className="three-body__dot"/>
        <div className="three-body__dot"/>
        <div className="three-body__dot"/>
      </div>
    </div>
  )
}

export default LoadingSpinner