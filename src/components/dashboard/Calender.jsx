import React, { useState, useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { Badge } from '@mui/material';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  FileText, 
  ChevronLeft, 
  ChevronRight,
  X,
  Eye
} from 'lucide-react';

// Styled Badge for appointment indicators
const StyledBadge = styled(Badge)(({  }) => ({
  '& .MuiBadge-badge': {
    right: 2,
    top: 2,
    border: `1px solid #3b82f6`,
    backgroundColor: '#3b82f6',
    color: 'white',
    fontSize: '8px',
    minWidth: '12px',
    height: '12px',
    borderRadius: '50%',
  },
}));

// Custom styled day component
const CustomPickersDay = styled(PickersDay)(({hasappointments }) => ({
  backgroundColor: hasappointments === 'true' ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
  border: hasappointments === 'true' ? '1px solid rgba(59, 130, 246, 0.3)' : 'none',
  color: '#e2e8f0',
  '&:hover': {
    backgroundColor: hasappointments === 'true' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(71, 85, 105, 0.3)',
  },
  '&.Mui-selected': {
    backgroundColor: '#3b82f6 !important',
    color: 'white',
  },
  '&.MuiPickersDay-today': {
    border: '1px solid #60a5fa !important',
  },
}));

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [appointments, setAppointments] = useState([]);
  const [selectedDayAppointments, setSelectedDayAppointments] = useState([]);
  const [showAppointments, setShowAppointments] = useState(false);
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'week'
  const [currentWeekStart, setCurrentWeekStart] = useState(dayjs().startOf('week'));

  
  useEffect(() => {
    const existingAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    setAppointments(existingAppointments);
  }, []);

  
  const getAppointmentsForDate = (date) => {
    return appointments.filter(appointment => 
      dayjs(appointment.appointmentDate).isSame(date, 'day')
    );
  };

  
  const hasAppointments = (date) => {
    return getAppointmentsForDate(date).length > 0;
  };

  
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    const dayAppointments = getAppointmentsForDate(newDate);
    setSelectedDayAppointments(dayAppointments);
    if (dayAppointments.length > 0) {
      setShowAppointments(true);
    }
  };

  
  const renderDay = (day, selectedDays, pickersDayProps) => {
    const hasAppt = hasAppointments(day);
    const appointmentCount = getAppointmentsForDate(day).length;

    if (hasAppt) {
      return (
        <StyledBadge
          key={day.toString()}
          badgeContent={appointmentCount}
          overlap="circular"
        >
          <CustomPickersDay
            {...pickersDayProps}
            hasappointments={hasAppt.toString()}
          />
        </StyledBadge>
      );
    }

    return (
      <CustomPickersDay
        {...pickersDayProps}
        hasappointments="false"
      />
    );
  };

  
  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(currentWeekStart.add(i, 'day'));
    }
    return days;
  };

  
  const navigateWeek = (direction) => {
    setCurrentWeekStart(prev => 
      direction === 'next' 
        ? prev.add(1, 'week')
        : prev.subtract(1, 'week')
    );
  };

  
  const formatAppointmentDate = (dateString) => {
    return dayjs(dateString).format('MMM DD, YYYY');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'scheduled': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className="mt-8">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-slate-100 flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-blue-400" />
            Appointment Calendar
          </h2>
          
          {/* View Mode Toggle */}
          <div className="flex bg-slate-700/50 rounded-lg p-1">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                viewMode === 'month' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                viewMode === 'week' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Week
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            {viewMode === 'month' ? (
                // Monthly View
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="bg-slate-800/40 rounded-lg p-4">
                  <DateCalendar
                  value={selectedDate}
                  onChange={handleDateChange}
                  renderDay={renderDay}
                  sx={{
                    backgroundColor: 'transparent',
                    '& .MuiPickersCalendarHeader-root': {
                    color: '#e2e8f0',
                    '& .MuiPickersArrowSwitcher-root button': {
                      color: '#e2e8f0',
                    },
                    },
                    '& .MuiDayCalendar-header': {
                    '& .MuiDayCalendar-weekDayLabel': {
                      color: '#e2e8f0',
                      fontWeight: 600,
                    },
                    },
                    '& .MuiPickersDay-root': {
                    color: '#e2e8f0',
                    },
                    '& .MuiPickersYear-yearButton': {
                    color: '#e2e8f0',
                    '&.Mui-selected': {
                      backgroundColor: '#3b82f6',
                    },
                    },
                    '& .MuiPickersMonth-monthButton': {
                    color: '#e2e8f0',
                    '&.Mui-selected': {
                      backgroundColor: '#3b82f6',
                    },
                    },
                  }}
                  />
                </div>
                </LocalizationProvider>
              ) : (
              // Weekly View
              <div className="bg-slate-800/40 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-slate-100">
                    Week of {currentWeekStart.format('MMM DD, YYYY')}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigateWeek('prev')}
                      className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
                    >
                      <ChevronLeft size={16} className="text-slate-300" />
                    </button>
                    <button
                      onClick={() => navigateWeek('next')}
                      className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
                    >
                      <ChevronRight size={16} className="text-slate-300" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {getWeekDays().map(day => {
                    const dayAppointments = getAppointmentsForDate(day);
                    const isSelected = day.isSame(selectedDate, 'day');
                    const isToday = day.isSame(dayjs(), 'day');
                    
                    return (
                      <div
                        key={day.toString()}
                        onClick={() => handleDateChange(day)}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-blue-600 text-white' 
                            : isToday
                            ? 'bg-blue-600/20 text-blue-400 border border-blue-400/30'
                            : dayAppointments.length > 0
                            ? 'bg-slate-700/50 text-slate-200 border border-blue-400/20'
                            : 'bg-slate-700/30 text-slate-300 hover:bg-slate-700/50'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-xs font-medium opacity-75">
                            {day.format('ddd')}
                          </div>
                          <div className="text-lg font-semibold">
                            {day.format('D')}
                          </div>
                          {dayAppointments.length > 0 && (
                            <div className="text-xs mt-1">
                              {dayAppointments.length} apt{dayAppointments.length !== 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Appointments List Section */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/40 rounded-lg p-4 h-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-medium text-slate-100">
                  {selectedDate.format('MMM DD, YYYY')}
                </h3>
                {selectedDayAppointments.length > 0 && (
                  <span className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded">
                    {selectedDayAppointments.length} appointment{selectedDayAppointments.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin">
                {selectedDayAppointments.length > 0 ? (
                  selectedDayAppointments.map((appointment) => (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-slate-100 text-sm truncate">
                          {appointment.title}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>
                      
                      {appointment.description && (
                        <p className="text-xs text-slate-300 mb-2 line-clamp-2">
                          {appointment.description}
                        </p>
                      )}
                      
                      <div className="flex items-center text-xs text-slate-400">
                        <Clock size={12} className="mr-1" />
                        <span>{formatAppointmentDate(appointment.appointmentDate)}</span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">No appointments scheduled</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-600 rounded"></div>
            <span>Selected Date</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-600/20 border border-blue-400/30 rounded"></div>
            <span>Today</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-slate-700/50 border border-blue-400/20 rounded"></div>
            <span>Has Appointments</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;