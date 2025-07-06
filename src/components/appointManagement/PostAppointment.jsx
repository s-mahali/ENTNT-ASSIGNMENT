import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Save,
  Loader2,
  X,
  Calendar,
  FileText,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";

const PostAppointment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const imgRef = useRef(null);
  const [scheduledIncident, setScheduledIncident] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  

  const [postAppointmentForm, setPostAppointmentForm] = useState({
    id: `p${Date.now()}`,
    cost: 0,
    treatment: "",
    status: "",
    nextDate: "",
    files: [],
  });
  

  const handleInputChange = (e) => {
    setPostAppointmentForm({
      ...postAppointmentForm,
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
    if (!postAppointmentForm.cost) {
      newErrors.cost = "Cost is required";
    }
    if (!postAppointmentForm.treatment.trim()) {
      newErrors.treatment = "treatment is required";
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

  const handleSavePostAppointment = async (e) => {
    e.preventDefault();
    if (!selectedIncident) {
      toast.error("Please select an appointment to complete");
      return;
    }
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const existingAppointments = JSON.parse(
        localStorage.getItem("appointments") || "[]"
      );
      const preAppointment = existingAppointments.find(
        (app) => app.id === selectedIncident.id
      );
      const completedAppointment = {
        ...postAppointmentForm,
        id: selectedIncident.id,
        title: selectedIncident.title,
        description: selectedIncident.description,
        comments: selectedIncident.comments,
        appointmentDate: selectedIncident.appointmentDate,
        status: "completed",
        patientId: preAppointment.patientId,
        
      };
      console.log("completedAppointment", completedAppointment);
      console.log("preAppointment", preAppointment);

      //Remove the pre-appointment object and add the completed one
      const newAppointmentsData = existingAppointments.filter(
        (app) => app.id !== selectedIncident.id
      );
      const allAppointments = [...newAppointmentsData, completedAppointment];
      saveAppointmentsToStorage(allAppointments);

      //Reset form and update scheduled incidents
      setPostAppointmentForm({
        id: `p${Date.now()}`,
        cost: 0,
        treatment: "",
        status: "",
        nextDate: "",
        files: [],
      });
      setScheduledIncident((prev) =>
        prev.filter((app) => app.id !== selectedIncident.id)
      );
      setSelectedIncident(null);
      console.log("updatedAppointments", allAppointments);
      toast.success("Appointment completed successfully");
    } catch (error) {
      console.error("error while saving appointment details", error.message);
      toast.error("error while saving appointment details");
    } finally {
      setIsLoading(false);
    }
  };

  //file upload
  const handleFileChange = (e) => {
    const MAX_FILESIZE = 5 * 1024 * 1024; //5mb

    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (files.some((file) => file.size > MAX_FILESIZE)) {
      toast.error("One or more files exceed the 5MB limit");
      return;
    }
    toast.loading("processing files...");

    const filePromise = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            name: file.name,
            url: reader.result,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromise)
      .then((processFiles) => {
        setPostAppointmentForm((prev) => ({
          ...prev,
          files: [...prev.files, ...processFiles],
        }));

        if (errors.files) {
          setErrors((prev) => ({
            ...prev,
            files: "",
          }));
        }

        toast.dismiss();
        toast.success(`${files.length} file(s) uploaded successfully`);
      })
      .catch((err) => {
        console.error("Error processing files:", err);
        toast.dismiss();
        toast.error("Failed to process files");
      });
  };

  const handleSelectIncident = (incident) => {
    setSelectedIncident(incident);
    console.log("incident", incident);
    console.log("selected", selectedIncident);
  };

  useEffect(() => {
    const existingIncident = JSON.parse(
      localStorage.getItem("appointments" || [])
    );
    const scheduledIncident = existingIncident.filter(
      (incident) => incident.status === "scheduled"
    );
    setScheduledIncident(scheduledIncident);
  }, []);
  console.log("scheduleIncident", scheduledIncident);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="container mx-auto p-4 lg:p-6">
        <h1 className="text-3xl font-bold text-slate-100 mb-6">Complete Scheduled Appointments</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column - Appointments list */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-5 h-full">
            <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-400" />
              Scheduled Appointments
            </h2>
            
            {scheduledIncident && scheduledIncident.length > 0 ? (
              <div className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-2 scrollbar-thin">
                {scheduledIncident.map((incident) => (
                  <motion.div
                    key={incident?.id}
                    onClick={() => handleSelectIncident(incident)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border cursor-pointer transition-all duration-200 ${
                      selectedIncident?.id === incident.id
                        ? "border-blue-500 bg-blue-900/20 shadow-lg shadow-blue-900/20"
                        : "border-slate-700/50 hover:border-slate-500"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-slate-100 truncate">
                        {incident.title}
                      </h3>
                      <div className="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 bg-yellow-400/10 border border-yellow-400/20">
                        <Clock className="w-3 h-3 text-yellow-400" />
                        <span className="text-yellow-400">
                          {incident.status}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-sm">
                          {new Date(incident.appointmentDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      
                      {incident.description && (
                        <div className="flex items-start gap-2">
                          <FileText className="w-4 h-4 text-slate-400 mt-1" />
                          <p className="text-sm text-slate-300 line-clamp-2">{incident.description}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center bg-slate-800/20 rounded-lg p-8 text-center">
                <Calendar className="w-12 h-12 text-slate-500 mb-3" />
                <h3 className="text-lg font-medium text-slate-300 mb-1">No scheduled appointments</h3>
                <p className="text-sm text-slate-400">All appointments have been completed</p>
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
                Complete Appointment Details
              </h2>
              
              {selectedIncident ? (
                <div className="bg-gradient-to-br from-slate-700 via-blue-900/30 to-slate-800 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-300 mb-2">Selected Appointment</h3>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <p className="text-slate-200">{selectedIncident.title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <p className="text-slate-300">{new Date(selectedIncident.appointmentDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-lg">
                  <p className="text-slate-400 text-center">Please select an appointment from the list</p>
                </div>
              )}
            </motion.div>

            <form className="space-y-5" onSubmit={handleSavePostAppointment}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Cost
                  </label>
                  <input
                    type="number"
                    name="cost"
                    value={postAppointmentForm.cost}
                    onChange={handleInputChange}
                    placeholder="Enter treatment cost"
                    className={`w-full px-4 py-2.5 bg-slate-700/30 border rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors  ${
                      errors.cost ? "border-red-500 ring-1 ring-red-500" : "border-slate-600"
                    }`}
                  />
                  {errors.cost && (
                    <p className="text-red-400 text-sm mt-1">{errors.cost}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Treatment
                  </label>
                  <input
                    type="text"
                    name="treatment"
                    value={postAppointmentForm.treatment}
                    onChange={handleInputChange}
                    placeholder="Root Canal, Dental Cleaning, etc"
                    className={`w-full px-4 py-2.5 bg-slate-700/30 border rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors  ${
                      errors.treatment ? "border-red-500 ring-1 ring-red-500" : "border-slate-600"
                    }`}
                  />
                  {errors.treatment && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.treatment}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Next Appointment Date
                  </label>
                  <input
                    type="date"
                    name="nextDate"
                    value={postAppointmentForm.nextDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 bg-slate-700/30 border rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors  ${
                      errors.nextDate ? "border-red-500" : "border-slate-600"
                    }`}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Files
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="files"
                      onChange={handleFileChange}
                      ref={imgRef}
                      multiple
                      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt,.csv"
                      className={`w-full px-4 py-2.5 bg-slate-700/30 border rounded-lg text-slate-100 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-500 focus:outline-none ${
                        errors.files ? "border-red-500" : "border-slate-600"
                      }`}
                    />
                  </div>
                </div>
                
                {postAppointmentForm.files.length > 0 && (
                  <div className="mt-4 bg-slate-700/20 p-3 rounded-lg">
                    <p className="text-sm font-medium text-slate-200 mb-3">
                      Uploaded files ({postAppointmentForm.files.length})
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {postAppointmentForm.files.map((file, index) => (
                        <div
                          key={index}
                          className="bg-slate-700/40 rounded-lg overflow-hidden flex flex-col"
                        >
                          <div className="flex items-center justify-between p-2 border-b border-slate-600">
                            <span className="text-sm text-slate-300 truncate max-w-[80%]">
                              {file.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setPostAppointmentForm((prev) => ({
                                  ...prev,
                                  files: prev.files.filter(
                                    (_, i) => i !== index
                                  ),
                                }));
                              }}
                              className="p-1 rounded-full hover:bg-slate-600/50"
                              aria-label="Remove file"
                            >
                              <X size={16} className="text-red-400" />
                            </button>
                          </div>
                          {file.url.startsWith("data:image") ? (
                            <div className="relative pt-[56.25%]">
                              <img
                                src={file.url}
                                alt="Image preview"
                                className="absolute top-0 left-0 h-full w-full object-contain p-2"
                              />
                            </div>
                          ) : (
                            <div className="p-4 flex items-center justify-center bg-slate-700/30 h-20">
                              <p className="text-slate-300 text-sm truncate max-w-full">
                                {file.name.split('.').pop().toUpperCase()} file
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 pt-4">
                <motion.button
                  type="submit"
                  disabled={isLoading || !selectedIncident}
                  whileHover={{ scale: (!isLoading && selectedIncident) ? 1.02 : 1 }}
                  whileTap={{ scale: (!isLoading && selectedIncident) ? 0.98 : 1 }}
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
                  Complete Appointment
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => {
                    setPostAppointmentForm({
                      id: `p${Date.now()}`,
                      cost: "",
                      treatment: "",
                      status: "",
                      nextDate: "",
                      files: [],
                    });
                    setErrors({});
                    setSelectedIncident(null);
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

export default PostAppointment;
