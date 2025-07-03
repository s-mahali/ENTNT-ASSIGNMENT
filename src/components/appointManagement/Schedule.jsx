import { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Heart, User, UserRound, CalendarPlus } from "lucide-react";
import PreAppointment from "./PreAppointment";

const Schedule = () => {
  const { patients } = useSelector((store) => store.patients);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPreAppointment, setShowPreAppointment] = useState(false);

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

   const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    showPreAppointment(true);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex">
      {/* Left section - Patient list */}
      <div className={`transition-all duration-300 overflow-y-auto ${showPreAppointment ? 'w-1/2' : 'w-full'} p-6`}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-slate-100">
            Select Patient
          </h1>
          <p className="text-slate-400 mt-2">
            Choose a patient to schedule a new appointment
          </p>
        </motion.div>
        
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 animate-pulse">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-slate-700 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-700 rounded w-24"></div>
                      <div className="h-3 bg-slate-700 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-700 rounded w-32"></div>
                    <div className="h-3 bg-slate-700 rounded w-28"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {patients && patients.length > 0 ? (
                patients.map((patient) => (
                  <motion.div
                    key={patient.id}
                    variants={cardVariants}
                    whileHover={{ y: -5, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePatientSelect(patient)}
                    className={`cursor-pointer bg-slate-800/50 backdrop-blur-md rounded-2xl p-5 border transition-all duration-300 ${
                      selectedPatient?.id === patient.id
                        ? 'border-blue-500 bg-blue-900/20'
                        : 'border-slate-700/50 hover:border-slate-600/50'
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                        <UserRound size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-100">
                          {patient.name}
                        </h3>
                        <p className="text-sm text-slate-400">
                          Age {calculateAge(patient.dob)}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-700/50">
                      <div className="flex items-start gap-2">
                        <Heart size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-slate-300 line-clamp-2">
                          {patient.healthInfo}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <span className="flex items-center text-xs text-blue-400 font-medium">
                        <CalendarPlus size={14} className="mr-1" />
                        Schedule appointment
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <User size={64} className="text-slate-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-100 mb-2">
                    No Patients Found
                  </h3>
                  <p className="text-slate-400">
                    Add your first patient to get started
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Right section - PreAppointment form */}
      {showPreAppointment && (
        <div className="w-1/2 border-l border-slate-700/50">
          <PreAppointment 
            open={showPreAppointment} 
            patient={selectedPatient}
            onClose={() => {
              setShowPreAppointment(false);
              setSelectedPatient(null);
            }} 
          />
        </div>
      )}
    </div>
  );
};

export default Schedule;
