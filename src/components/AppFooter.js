import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="bg-oxford-blue-2 cl-white">
      <div>
        Universitas Sumatera Utara
        <span className="ms-1">&copy; 2022 FASILKOM-TI.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Dibuat oleh</span>
        Fauzan Zaman
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
