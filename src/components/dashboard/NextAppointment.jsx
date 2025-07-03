import React from "react";
import {
  Calendar,
  Clock,
  FileText,
  User,
  CheckCircle,
  CalendarClock,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
const appointments = [
  {
    id: 1,
    title: "Root Canal Treatment",
    description: "Complete root canal procedure on lower molar",
    comments: "Patient has reported sensitivity to cold",
    appointmentDate: "2023-06-01",
    status: "scheduled",
  },
  {
    id: 2,
    title: "Appointment 2",
    description: "Description 2",
    comments: "Comments 2",
    appointmentDate: "2023-06-02",
    status: "scheduled",
  },
  {
    id: 3,
    title: "Appointment 3",
    description: "Description 3",
    comments: "Comments 3",
    appointmentDate: "2023-06-03",
    status: "scheduled",
  },
];

const NextAppointment = () => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const StatusBadge = ({ status }) => {
    const statusStyles = {
      completed: "bg-emerald-500/20 text-emerald-500 border-emerald-500/30",
      scheduled: "bg-blue-500/20 text-blue-500 border-blue-500/30",
      cancelled: "bg-red-500/20 text-red-500 border-red-500/30",
      pending: "bg-amber-500/20 text-amber-500 border-amber-500/30",
    };
    const statusIcons = {
      completed: <CheckCircle size={16} className="mr-1" />,
      scheduled: <CalendarClock size={16} className="mr-1" />,
      cancelled: <X size={16} className="mr-1" />,
      pending: <Clock size={16} className="mr-1" />,
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center border ${
          statusStyles[status] || ""
        }`}
      >
        {statusIcons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
  return (
    <motion.div
      className="p-4 max-w-lg w-full mx-auto"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">
        Upcoming Appointments
      </h1>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-4"
      > 
        {appointments &&
          appointments.map((appointment) => (
            <motion.div
              key={appointment.id}
               variants={cardVariants}
                  whileHover={{
                    y: -2,
                    scale: 1.01,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.99 }}
              className="group cursor-pointer bg-slate-800/70 rounded-lg p-5 border backdrop-blur-md  border-slate-700/50 hover:border-slate-600/50 transition-all duration-300  relative"
            >
              <div className="absolute top-2 flex items-center justify-between gap-3">
                <div className="w-2 h-2 bg-red-400 rounded-full "></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">
                  {appointment.title}
                </h3>
                <StatusBadge status={appointment.status} />
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-slate-600 dark:text-slate-300 text-sm">
                  <Calendar size={16} className="mr-2 flex-shrink-0" />
                  <span>{formatDate(appointment.appointmentDate)}</span>
                </div>

                {/* {appointment.description && (
                  <div className="flex items-start text-slate-600 dark:text-slate-300 text-sm">
                    <FileText size={16} className="mr-2 flex-shrink-0 mt-1" />
                    <p>{appointment.description}</p>
                  </div>
                )}
                {appointment.comments && (
                  <div className="flex items-start text-slate-500 dark:text-slate-400 text-sm">
                    <User size={16} className="mr-2 flex-shrink-0 mt-1" />
                    <p className="italic">{appointment.comments}</p>
                  </div>
                )} */}
              </div>
            </motion.div>
          ))}
      </motion.div>
    </motion.div>
  );
};

export default NextAppointment;
