import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Download,
  Heart,
  Phone,
  Mail,
  Eye,
  X,
  AlertCircle,
} from "lucide-react";
import { useSelector } from "react-redux";

const UserDashboard = () => {
  const [patientData, setPatietData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showFileModal, setShowFileModal] = useState(false);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const { user } = useSelector((store) => store.auth);
  const { patients } = useSelector((store) => store.patients);

  useEffect(() => {
    if (patients && patients?.length > 0) {
      const patient = patients.find((p) => p.userId === user.id);
      setPatietData(patient);

      const allAppointments = JSON.parse(
        localStorage.getItem("appointments") || "[]"
      );
      const userAppointments =
        allAppointments &&
        allAppointments.filter((app) => app.patientId === patient.id);
      setAppointments(userAppointments);

      const now = new Date();
      const upcoming =
        userAppointments &&
        userAppointments.filter(
          (app) =>
            (new Date(app.appointmentDate) >= now &&
              app.status === "scheduled") ||
            app.status === "scheduled"
        );
      const past =
        userAppointments &&
        userAppointments.filter((app) => app.status === "completed");
      setUpcomingAppointments(upcoming);
      setPastAppointments(past);
    } else {
      setPatietData(null);
      setAppointments([]);
      setUpcomingAppointments([]);
      setPastAppointments([]);
    }
  }, [patients]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "scheduled":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "cancelled":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const handleFileView = (file) => {
    setSelectedFile(file);
    setShowFileModal(true);
  };

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

  if (!patientData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-100 mb-2">
            Create Your Patient Account{" "}
          </h2>
          <p className="text-slate-400">
            If any issue then please contact with admin{" "}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Patient Info */}
      <div className="bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow">
            <User size={32} className="text-white" />
          </div>
          <div className="flex-1 w-full">
            <h2 className="text-2xl font-bold text-slate-100 mb-2 text-center sm:text-left">
              {patientData.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-300">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <Calendar size={16} className="text-slate-400" />
                <span>Age: {calculateAge(patientData.dob)} years</span>
              </div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <Phone size={16} className="text-slate-400" />
                <span>{patientData.contact}</span>
              </div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <Mail size={16} className="text-slate-400" />
                <span>{user.email}</span>
              </div>
            </div>
            {patientData.healthInfo && (
              <div className="mt-3 flex items-start gap-2 justify-center sm:justify-start">
                <Heart
                  size={16}
                  className="text-red-400 mt-0.5 flex-shrink-0"
                />
                <p className="text-slate-300">{patientData.healthInfo}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Appointments */}
      <div className="bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <h3 className="text-xl font-semibold text-slate-100 text-center md:text-left">
            My Appointments
          </h3>
          <div className="flex bg-slate-700/50 rounded-lg p-1 self-center">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-4 py-2 rounded text-sm transition-colors ${
                activeTab === "upcoming"
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Upcoming ({upcomingAppointments?.length})
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 rounded text-sm transition-colors ${
                activeTab === "history"
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              History ({pastAppointments?.length})
            </button>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4 overflow-x-auto">
          {(activeTab === "upcoming" ? upcomingAppointments : pastAppointments)
            ?.length > 0 ? (
            (activeTab === "upcoming"
              ? upcomingAppointments
              : pastAppointments
            )?.map((appointment) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-700/50 rounded-xl p-5 border border-slate-600/50 shadow hover:shadow-lg transition-shadow flex flex-col lg:flex-row gap-6"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h4 className="text-lg font-semibold text-slate-100">
                      {appointment.title}
                    </h4>
                    <span
                      className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Calendar size={16} className="text-slate-400" />
                      <span>{formatDate(appointment.appointmentDate)}</span>
                    </div>
                    {appointment.treatment && (
                      <div className="flex items-center gap-2 text-slate-300">
                        <FileText size={16} className="text-slate-400" />
                        <span>{appointment.treatment}</span>
                      </div>
                    )}
                    {appointment.cost && (
                      <div className="flex items-center gap-2 text-slate-300">
                        <DollarSign size={16} className="text-green-400" />
                        <span className="text-green-400 font-medium">
                          ${appointment.cost}
                        </span>
                      </div>
                    )}
                    {appointment.nextDate && (
                      <div className="flex items-center gap-2 text-slate-300">
                        <Clock size={16} className="text-blue-400" />
                        <span>Next: {formatDate(appointment.nextDate)}</span>
                      </div>
                    )}
                  </div>
                  {appointment.description && (
                    <div className="mt-3 p-3 bg-slate-800/50 rounded-lg">
                      <p className="text-slate-300 text-sm">
                        {appointment.description}
                      </p>
                    </div>
                  )}
                </div>
                {/* Files Section */}
                {appointment.files && appointment.files.length > 0 && (
                  <div className="lg:w-1/3">
                    <h5 className="text-sm font-medium text-slate-200 mb-2">
                      Attachments
                    </h5>
                    <div className="space-y-2">
                      {appointment.files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-slate-800/50 rounded-lg p-2"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <FileText
                              size={16}
                              className="text-blue-400 flex-shrink-0"
                            />
                            <span className="text-slate-300 text-sm truncate">
                              {file.name}
                            </span>
                          </div>
                          <button
                            onClick={() => handleFileView(file)}
                            className="p-1 rounded hover:bg-slate-700/50 transition-colors"
                            title="View file"
                          >
                            <Eye
                              size={16}
                              className="text-slate-400 hover:text-slate-200"
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-slate-300 mb-2">
                No {activeTab === "upcoming" ? "upcoming" : "past"} appointments
              </h4>
              <p className="text-slate-400">
                {activeTab === "upcoming"
                  ? "You have no scheduled appointments"
                  : "No appointment history available"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* File Modal */}
      {showFileModal && selectedFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-xl p-6 max-w-4xl max-h-[90vh] overflow-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-slate-100">
                {selectedFile.name}
              </h4>
              <button
                onClick={() => setShowFileModal(false)}
                className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4">
              {selectedFile.url.startsWith("data:image") ? (
                <img
                  src={selectedFile.url}
                  alt={selectedFile.name}
                  className="max-w-full h-auto rounded"
                />
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-300 mb-4">{selectedFile.name}</p>
                  <a
                    href={selectedFile.url}
                    download={selectedFile.name}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download size={16} />
                    Download File
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
