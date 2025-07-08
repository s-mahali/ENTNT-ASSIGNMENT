import React, { useEffect, useState } from "react";
import UserDashboard from "../components/userdashboard/UserDashboard";
import AddPatientForm from "../components/patientManagement/AddPatientForm";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const UserDashboardPage = () => {
  const { user } = useSelector((store) => store.auth);
  const [isPatient, setIsPatient] = useState(false);
  const [isPatientForm, setIsPatientForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const {patients} = useSelector((store) => store.patients);
  const patient = patients?.find((p) => p.userId === user.id);
  
  useEffect(() => {
    
    if (patient) {
      setIsPatient(true);
      setIsPatientForm(false);
    }
    if (user?.role === "admin") {
      setIsAdmin(true);
    }
  }, [patient]);

 

  return (
     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-3xl mx-auto">
        {isPatient ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/80 rounded-2xl shadow-xl p-4 md:p-8"
          >
            <UserDashboard />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/80 rounded-2xl shadow-xl p-4 md:p-8 flex flex-col items-center"
          >
            <button
              onClick={() => setIsPatientForm(true)}
              disabled={isAdmin}
              className={`mb-6 px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-200
                ${
                  isAdmin
                    ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:scale-105"
                }
              `}
            >
              Create Patient Account {isAdmin && "(Disabled for Admin)"}
            </button>
            <h3 className="text-2xl font-bold mb-4 text-center">
              Create your Patient Account
            </h3>
            <AnimatePresence>
              {isPatientForm && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="w-full"
                >
                  <AddPatientForm />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserDashboardPage;
