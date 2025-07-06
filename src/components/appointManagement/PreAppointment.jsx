import { useState } from "react";
import { motion } from "framer-motion";
import {
  Save,
  Loader2,
  X,
  UsersRound,
  PhoneIcon,
  Group,
  Clock,
  Calendar,
  FileText,
  BookUser,
  UserRound,
  Phone,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";


const PreAppointment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { patients } = useSelector((store) => store.patients);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [preAppointmentForm, setPreAppointmentForm] = useState({
    id: `p${Date.now()}`,
    patientId: selectedPatientId,
    title: "",
    description: "",
    comments: "",
    appointmentDate: "",
  });

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
    setSelectedPatientId(patient.id);
  };


  const handleInputChange = (e) => {
    setPreAppointmentForm({
      ...preAppointmentForm,
      [e.target.name]: e.target.value,
    });

    if (errors[e.target.name]) {
      setErrors((prev) => ({
        ...prev,
        [e.target.name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!preAppointmentForm.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!preAppointmentForm.description.trim()) {
      newErrors.description = "description is required";
    }
    if (!preAppointmentForm.comments.trim()) {
      newErrors.comments = "comment is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveAppointmentsToStorage = (appointmentsData) => {
    try {
      localStorage.setItem(
        "appointments",
        JSON.stringify(appointmentsData || [])
      );
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  const handleSavePreAppointment = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const existingAppointments = JSON.parse(
        localStorage.getItem("appointments") || "[]"
      );
      const newAppointment = {
        ...preAppointmentForm,
        id: `app_${Date.now()}`,
        title: preAppointmentForm.title.trim(),
        patientId: selectedPatientId,
        status: "scheduled", // scheduled, completed
        createdAt: new Date().toISOString(),
      };

      // Add to array and save
      const updatedAppointments = [...existingAppointments, newAppointment];
      saveAppointmentsToStorage(updatedAppointments);

      // Reset form
      setPreAppointmentForm({
        title: "",
        description: "",
        comments: "",
        appointmentDate: "",
      });
      setErrors({});

      console.log("appointmentData", newAppointment);
      toast.success("Appointment scheduled successfully");
    } catch (error) {
      console.error("error while saving appointment", error.message);
      toast.error("error while saving appointment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="container mx-auto p-4 lg:p-6">
        <h1 className="text-3xl font-bold text-slate-100 mb-6">
          Schedule Appointments
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column - Patient list */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-5 h-full">
            <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center">
              <UsersRound className="w-5 h-5 mr-2 text-blue-400" />
              All Patients
            </h2>

            {patients && patients.length > 0 ? (
              <div className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-2 scrollbar-thin">
                {patients.map((patient) => (
                  <motion.div
                    key={patient?.id}
                    onClick={() => handlePatientSelect(patient)}
                    whileHover={{ scale: 1 }}
                    whileTap={{ scale: 0.99 }}
                    className={`bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border cursor-pointer transition-all duration-200 ${
                      selectedPatient?.id === patient.id
                        ? "border-blue-500 bg-blue-900/20 shadow-lg shadow-blue-900/20"
                        : "border-slate-700/50 hover:border-slate-500"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-slate-100 truncate">
                        {patient.name}
                      </h3>
                      <div className="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 bg-yellow-400/10 border border-yellow-400/20">
                        <Link to={`/patients`}>
                          <BookUser className="w-3 h-3 text-yellow-400" />
                        </Link>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-sm">
                          {calculateAge(patient.dob)} years old
                        </span>
                      </div>

                      {patient.healthInfo && (
                        <div className="flex items-start gap-2">
                          <FileText className="w-4 h-4 text-slate-400 mt-1" />
                          <p className="text-sm text-slate-300 line-clamp-2">
                            {patient.healthInfo}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center bg-slate-800/20 rounded-lg p-8 text-center">
                <UsersRound className="w-12 h-12 text-slate-500 mb-3" />
                <h3 className="text-lg font-medium text-slate-300 mb-1">
                  No Patients Found
                </h3>
                <p className="text-sm text-slate-400">
                  Please add patient to schedule appointments.
                </p>
              </div>
            )}
          </div>

          {/* Right column - Form */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-5">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center">
                <Save className="w-5 h-5 mr-2 text-green-400" />
                Appointment Details
              </h2>

              {selectedPatient ? (
                <div className="bg-gradient-to-br from-slate-700 via-blue-900/30 to-slate-800 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-300 mb-2">
                    Selected Patient
                  </h3>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-2">
                      <UserRound className="w-4 h-4 text-slate-400" />
                      <p className="text-slate-200">{selectedPatient.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <p className="text-slate-300">
                        {selectedPatient.contact}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-lg">
                  <p className="text-slate-400 text-center">
                    Please select a patient from the list
                  </p>
                </div>
              )}
            </motion.div>

            <form className="space-y-5" onSubmit={handleSavePreAppointment}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={preAppointmentForm.title}
                    onChange={handleInputChange}
                    placeholder="Root Canal, Dental Cleaning, etc"
                    className={`w-full px-4 py-2.5 bg-slate-700/30 border rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors  ${
                      errors.title
                        ? "border-red-500 ring-1 ring-red-500"
                        : "border-slate-600"
                    }`}
                  />
                  {errors.title && (
                    <p className="text-red-400 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={preAppointmentForm.description}
                    onChange={handleInputChange}
                    placeholder="Detailed visited reason"
                    className={`w-full px-4 py-2.5 bg-slate-700/30 border rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors  ${
                      errors.description
                        ? "border-red-500 ring-1 ring-red-500"
                        : "border-slate-600"
                    }`}
                  />
                  {errors.description && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Comments
                  </label>
                  <input
                    type="text"
                    name="comments"
                    value={preAppointmentForm.comments}
                    placeholder="Doctor's Notes, Patient concerns, etc"
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 bg-slate-700/30 border rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors  ${errors.comments} ? "border-red-500" : "border-slate-600"
                    }`}
                  />
                  {errors.comments && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.comments}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    name="appointmentDate"
                    value={preAppointmentForm.appointmentDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 bg-slate-700/30 border rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors  ${errors.appointmentDate} ? "border-red-500" : "border-slate-600"
                    }`}
                  />
                  {errors.appointmentDate && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.appointmentDate}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <motion.button
                  type="submit"
                  disabled={isLoading || !selectedPatient}
                  whileHover={{
                    scale: !isLoading && selectedPatient ? 1.02 : 1,
                  }}
                  whileTap={{ scale: !isLoading && selectedPatient ? 0.98 : 1 }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Loader2 size={18} />
                    </motion.div>
                  ) : (
                    <Save size={18} />
                  )}
                  Schedule Appointment
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => {
                    setErrors({});
                    setSelectedPatient(null);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700/50 transition-colors font-medium"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreAppointment;
