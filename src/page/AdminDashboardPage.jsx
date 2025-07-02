import React from 'react'
import TopPatients from '../components/dashboard/TopPatients'
import NextAppointment from '../components/dashboard/NextAppointment'
import Stats from '../components/dashboard/Stats'
import RevenueChart from '../components/dashboard/RevenueChart'

const AdminDashboardPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex">
       <div className="">
        <TopPatients/>
       </div>
       <div className="">
        <NextAppointment/>
       </div>
       <div className="flex flex-col">
        <div>
          <Stats/>
        </div>
        <div className=''>
          <RevenueChart/>
        </div>
       </div>
    </div>
  )
}

export default AdminDashboardPage