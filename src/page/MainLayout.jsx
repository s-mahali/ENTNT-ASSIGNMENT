import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftNavbar from '../components/LeftNavbar'

const MainLayout = () => {
  return (
    <div>
      <LeftNavbar/>
      <div className='md:ml-16'>
        <Outlet/>
      </div>
    </div>
  )
}

export default MainLayout