import React, { useEffect, useState } from "react";
import { Calendar, Heart, Phone, User, Star, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import {useSelector} from 'react-redux'

// const patients = [
//   {
//     id: "p1",
//     name: "John Doe",
//     dob: "1990-05-10",
//     contact: "1234567890",
//     healthInfo: "No allergies",
//     visits: 12,
//     lastVisit: "2024-06-15",
//   },
//   {
//     id: "p2",
//     name: "Eren Yeager",
//     dob: "1985-03-22",
//     contact: "9876543210",
//     healthInfo: "Diabetes Type 2",
//     visits: 8,
//     lastVisit: "2024-06-10",
//   },
//   {
//     id: "p3",
//     name: "Levi Ackerman",
//     dob: "1978-12-25",
//     contact: "5555551234",
//     healthInfo: "Allergic to penicillin",
//     visits: 15,
//     lastVisit: "2024-06-20",
//   },
//   {
//     id: "p4",
//     name: "Mikasa Ackerman",
//     dob: "1992-02-10",
//     contact: "7777778888",
//     healthInfo: "Asthma",
//     visits: 6,
//     lastVisit: "2024-06-05",
//   },
//   {
//     id: "p5",
//     name: "Armin Arlert",
//     dob: "1993-11-03",
//     contact: "3333334444",
//     healthInfo: "No known conditions",
//     visits: 10,
//     lastVisit: "2024-06-18",
//   },
// ];


const TopPatients = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [patientStats, setPatientStats] = useState([]);
  const {patients} = useSelector((store) => store.patients);

  useEffect(() => {
      setIsLoading(true);
    const existingAppointments = JSON.parse(localStorage.getItem('appointments') || "[]");

    // Map each patient to their visit count and last visit date
    const stats = patients.map((patient) => {
      const patientAppointments = existingAppointments.filter(
        (app) => app.patientId === patient.id
      );
      const visits = patientAppointments.length;
      let lastVisit = null;
      if (visits > 0) {
        
        lastVisit = patientAppointments
          .map(app => new Date(app.appointmentDate || app.nextDate))
          .sort((a, b) => b - a)[0];
      }
      return {
        ...patient,
        visits: visits,
        lastVisit: lastVisit,
      };
    });

    

    setPatientStats(stats.slice(0, 10)); // Top 10
    setIsLoading(false);
      
      
    
    
  },[patients])

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
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

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Header */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">
              Top 10 Patients
            </h2>
            <p className="text-slate-400">Most frequent visitors this month</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span>Sorted by visit frequency</span>
        </div>
      </motion.div>

      {/* Patient Cards */}
      <div className="space-y-4">
        {isLoading ? (
          // Loading Skeleton
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                      <div className="w-3 h-3 bg-slate-600 rounded"></div>
                    </div>
                    <div className="w-12 h-12 bg-slate-700 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div className="space-y-2">
                        <div className="h-5 bg-slate-700 rounded w-32"></div>
                        <div className="h-4 bg-slate-700 rounded w-20"></div>
                      </div>
                      <div className="h-6 bg-slate-700 rounded w-16"></div>
                    </div>
                    <div className="flex gap-4 mb-3">
                      <div className="h-4 bg-slate-700 rounded w-24"></div>
                      <div className="h-4 bg-slate-700 rounded w-20"></div>
                    </div>
                    <div className="h-4 bg-slate-700 rounded w-40"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {patientStats && patientStats.length > 0 ? (
              patientStats.map((patient, index) => (
                <motion.div
                  key={patient.id}
                  variants={cardVariants}
                  whileHover={{
                    y: -2,
                    scale: 1.01,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.99 }}
                  className="group cursor-pointer bg-slate-800/70 backdrop-blur-md rounded-2xl p-5  border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:bg-slate-800/70"
                >
                  <div className="flex items-center gap-4">
                    {/* Patient Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-100 group-hover:text-white transition-colors">
                            {patient.name}
                          </h3>
                          <p className="text-sm text-slate-400">
                            Age {calculateAge(patient.dob)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-emerald-400">
                            {patient.visits} visits
                          </div>
                          <div className="text-xs text-slate-500">
                            Last: {formatDate(patient.lastVisit)}
                          </div>
                        </div>
                      </div>

                      {/* <div className="flex gap-4 mb-3">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Phone size={14} className="text-blue-400" />
                          {patient.contact}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Calendar size={14} className="text-blue-400" />
                          {new Date(patient.dob).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Heart
                          size={14}
                          className="text-red-400 mt-0.5 flex-shrink-0"
                        />
                        <div className="flex-1 flex justify-between items-center">
                          <p className="text-sm text-slate-300 line-clamp-1">
                            {patient.healthInfo}
                          </p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="ml-4 px-3 py-1 text-xs font-medium text-blue-400 hover:text-blue-300 border border-blue-400/30 hover:border-blue-300/50 rounded-lg transition-all duration-200 hover:bg-blue-400/10"
                          >
                            Manage
                          </motion.button>
                        </div>
                      </div> */}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div variants={cardVariants} className="text-center py-16">
                <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={32} className="text-slate-500" />
                </div>
                <h3 className="text-xl font-semibold text-slate-100 mb-2">
                  No Patients Found
                </h3>
                <p className="text-slate-400">
                  Add your first patient to get started with the ranking system
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* Footer Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className=" mt-2 pt-4 border-t border-slate-700/50"
      >
        <div className="flex justify-between items-center text-sm text-slate-400">
          <span>Showing top {patients.length} patients</span>
          
        </div>
      </motion.div>
    </div>
  );
};

export default TopPatients;
