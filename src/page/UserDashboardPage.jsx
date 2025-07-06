import React, { useEffect, useState } from "react";
import UserDashboard from "../components/userdashboard/UserDashboard";
import AddPatientForm from "../components/patientManagement/AddPatientForm";
import { useSelector } from "react-redux";

const UserDashboardPage = () => {
  const { user } = useSelector((store) => store.auth);
  const [isPatient, setIsPatient] = useState(false);
  const [isPatientForm, setIsPatientForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (user.pateintId) {
      setIsPatient(true);
      setIsPatientForm(false);
    }
    if (user.role === "admin") {
      setIsAdmin(true);
    }
  }, [isPatient, isPatientForm]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white p-5 flex md:gap-5">
      {isPatient ? (
        <div className="lg:w-1/2 md:w-full p-4 md:p-6">
          
          <UserDashboard />
        </div>
      ) : (
        <div className="lg:w-1/2 md:w-full p-4 md:p-6">
          <button onClick={() => setIsPatientForm(true)} disabled={isAdmin}>
            Create Patient Account {isAdmin && "(Disabled for Admin)"}
          </button>
          <h3 className="text-2xl font-bold mb-4">
            Create your Patient Account
          </h3>
          {isPatientForm && <AddPatientForm />}
        </div>
      )}
    </div>
  );
};

export default UserDashboardPage;
