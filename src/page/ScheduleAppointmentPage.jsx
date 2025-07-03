import React from 'react'
import PreAppointment from '../components/appointManagement/PreAppointment'
import Schedule from '../components/appointManagement/Schedule'

const ScheduleAppointmentPage = () => {
  return (
    <div className=''>
        <Schedule/>
        <div className=''>
            <PreAppointment/>
        </div>

    </div>
  )
}

export default ScheduleAppointmentPage