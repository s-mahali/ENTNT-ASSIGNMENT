import React, { useState } from 'react'
import { motion } from 'framer-motion'
import PostAppointment from './PostAppointment'
import AppointmentList from './AppointmentList'
import { Calendar, Plus, CheckCircle, List } from 'lucide-react'
import PreAppointment from './PreAppointment'

const AppointManagement = () => {
  const [activeTab, setActiveTab] = useState('schedule'); // schedule, complete, list

  const tabs = [
    {
      id: 'schedule',
      label: 'Schedule Appointment',
      icon: <Plus className="w-4 h-4" />,
      component: <PreAppointment/>
    },
    {
      id: 'complete',
      label: 'Complete Appointment',
      icon: <CheckCircle className="w-4 h-4" />,
      component: <PostAppointment />
    },
    {
      id: 'list',
      label: 'View All Appointments',
      icon: <List className="w-4 h-4" />,
      component: <AppointmentList />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Navigation Tabs */}
      <div className="ml-5 sticky top-0 z-10 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center">
            <div className="flex bg-slate-800/50 rounded-lg p-1 my-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {tabs.find(tab => tab.id === activeTab)?.component}
      </motion.div>
    </div>
  )
}

export default AppointManagement