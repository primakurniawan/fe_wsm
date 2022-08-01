import React from 'react'
import { AppContent, AppFooter, AppHeader } from '../components/index'
import './../index.scss'
const DefaultLayout = () => {
  return (
    <div className="bg-oxford-blue">
      <div className="wrapper d-flex flex-column min-vh-100 bg-light bg-oxford-blue">
        <AppHeader />
        <div className="body flex-grow-1 px-3 bg-oxford-blue">
          <AppContent />
        </div>
        <AppFooter/>
      </div>
    </div>
  )
}

export default DefaultLayout
