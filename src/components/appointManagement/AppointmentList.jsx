import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useSelector } from 'react-redux';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all'); // all, scheduled, completed, cancelled
  const {patients} = useSelector((store) => store.patients);
  useEffect(() => {
    loadAppointments();
  }, []);

  

  

  const loadAppointments = () => {
    const savedAppointments = JSON.parse(localStorage.getItem("appointments") || "[]");
    setAppointments(savedAppointments);
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'scheduled':
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'cancelled':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'scheduled':
      default:
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4">
          Appointment History
        </h1>
        <p className="text-slate-300">View and manage all appointments</p>
      </motion.div>

      {/* Filter Buttons */}
      <div className="flex justify-center mb-8">
        <div className="flex bg-slate-800/50 rounded-lg p-1 backdrop-blur-sm">
          {['all', 'scheduled', 'completed', 'cancelled'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                filter === filterType
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {filterType}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments Grid */}
      <div className="max-w-6xl mx-auto">
        {filteredAppointments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">
              No appointments found
            </h3>
            <p className="text-slate-400">
              {filter === 'all' ? 'No appointments have been scheduled yet.' : `No ${filter} appointments found.`}
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50 hover:border-slate-600/50 transition-colors"
              >
                
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-100 truncate">
                    {appointment.title}
                  </h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(appointment.status)}
                      {appointment.status}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {
                       formatDate(appointment.appointmentDate)
                      }
                    </span>
                  </div>

                  <div className="flex items-start gap-2 text-slate-300">
                    <FileText className="w-4 h-4 mt-0.5" />
                    <p className="text-sm line-clamp-2">
                      {appointment.description}
                    </p>
                  </div>

                  {appointment.comments && (
                    <div className="flex items-start gap-2 text-slate-400">
                      <User className="w-4 h-4 mt-0.5" />
                      <p className="text-sm line-clamp-2">
                        {appointment.comments}
                      </p>
                    </div>
                  )}

                  {/* Post-appointment details */}
                  {appointment.status === 'completed' && appointment.treatment && (
                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                      <h4 className="text-sm font-medium text-slate-200 mb-2">Treatment Details:</h4>
                      <p className="text-sm text-slate-300 line-clamp-2">
                        {appointment.treatment}
                      </p>
                      {appointment.nextDate && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-blue-400">
                          <Clock className="w-3 h-3" />
                          Follow-up: {formatDate(appointment.nextDate)}
                        </div>
                      )}
                    </div>
                  )}

                  
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentList;
