import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Loader2, Calendar, Edit, FileText } from "lucide-react";
import toast from "react-hot-toast";

const PreAppointment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isPostIncident, setIsPostIncident] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [appointments, setAppointments] = useState([]);

  const [preAppointmentForm, setPreAppointmentForm] = useState({
    patientId: "p1751285870453", // This should come from props or context
    title: "",
    description: "",
    comments: "",
    appointmentDate: "",
  });

  const [postAppointmentForm, setPostAppointmentForm] = useState({
    cost: "",
    treatment: "",
    status: "completed",
    nextDate: "",
    files: [],
  });

  // Load appointments on component mount
  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = () => {
    try {
      const storedAppointments = JSON.parse(
        localStorage.getItem("appointments") || "[]"
      );
      setAppointments(storedAppointments);
    } catch (error) {
      console.error("Error loading appointments:", error);
      setAppointments([]);
    }
  };

  const handlePreAppointmentChange = (e) => {
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

  const handlePostAppointmentChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setPostAppointmentForm({
        ...postAppointmentForm,
        [name]: Array.from(files),
      });
    } else {
      setPostAppointmentForm({
        ...postAppointmentForm,
        [name]: value,
      });
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validatePreAppointmentForm = () => {
    const newErrors = {};

    if (!preAppointmentForm.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!preAppointmentForm.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!preAppointmentForm.comments.trim()) {
      newErrors.comments = "Comments are required";
    }
    if (!preAppointmentForm.appointmentDate) {
      newErrors.appointmentDate = "Appointment date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePostAppointmentForm = () => {
    const newErrors = {};

    if (!postAppointmentForm.cost || postAppointmentForm.cost <= 0) {
      newErrors.cost = "Cost is required and must be greater than 0";
    }
    if (!postAppointmentForm.treatment.trim()) {
      newErrors.treatment = "Treatment description is required";
    }
    if (!postAppointmentForm.status.trim()) {
      newErrors.status = "Status is required";
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
    if (!validatePreAppointmentForm()) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create new appointment object
      const newAppointment = {
        ...preAppointmentForm,
        id: `app_${Date.now()}`,
        title: preAppointmentForm.title.trim(),
        description: preAppointmentForm.description.trim(),
        comments: preAppointmentForm.comments.trim(),
        status: "scheduled", // scheduled, completed, cancelled
      };

      // Add to array and save
      let updatedAppointments;
      if (appointments.length < 1) {
        updatedAppointments = [newAppointment];
      } else {
        updatedAppointments = [...appointments, newAppointment];
      }
      saveAppointmentsToStorage(updatedAppointments);
      setAppointments(updatedAppointments);

      // Reset form
      setPreAppointmentForm({
        patientId: preAppointmentForm.patientId,
        title: "",
        description: "",
        comments: "",
        appointmentDate: "",
      });
      setErrors({});

      console.log("New appointment created:", newAppointment);
      toast.success("Appointment scheduled successfully!");
    } catch (error) {
      console.error("Error saving appointment:", error.message);
      toast.error("Error scheduling appointment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePostAppointment = async (e) => {
    e.preventDefault();
    if (!validatePostAppointmentForm()) return;
    if (!selectedAppointmentId) {
      toast.error("Please select an appointment to update");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Find and update the specific appointment
      const updatedAppointments = appointments.map((appointment) => {
        if (appointment.id === selectedAppointmentId) {
          return {
            ...appointment,
            ...postAppointmentForm,
            status: "completed",
            completedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }
        return appointment;
      });

      saveAppointmentsToStorage(updatedAppointments);
      setAppointments(updatedAppointments);

      // Reset post-appointment form and switch back to pre-appointment view
      setPostAppointmentForm({
        cost: "",
        treatment: "",
        status: "completed",
        nextDate: "",
        files: [],
      });
      setSelectedAppointmentId(null);
      setIsPostIncident(false);
      setErrors({});

      toast.success("Appointment completed successfully!");
    } catch (error) {
      console.error("Error updating appointment:", error.message);
      toast.error("Error completing appointment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAppointment = (appointmentId) => {
    const appointment = appointments.find((app) => app.id === appointmentId);
    if (appointment) {
      setSelectedAppointmentId(appointmentId);
      setPostAppointmentForm({
        cost: appointment.cost || "",
        treatment: appointment.treatment || "",
        status: appointment.status === "completed" ? "completed" : "completed",
        nextDate: appointment.nextDate || "",
        files: appointment.files || [],
      });
      setIsPostIncident(true);
    }
  };

  const handleCancelEdit = () => {
    setIsPostIncident(false);
    setSelectedAppointmentId(null);
    setPostAppointmentForm({
      cost: "",
      treatment: "",
      status: "completed",
      nextDate: "",
      files: [],
    });
    setErrors({});
  };

  // Filter appointments for current patient
  const patientAppointments =
    appointments.length > 0
      ? appointments.filter(
          (app) =>
            app.patientId === preAppointmentForm.patientId &&
            app.status === "scheduled"
        )
      : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4">
          {isPostIncident ? "Complete Incident" : "Schedule New Incident"}
        </h1>
        <p className="text-slate-300 text-lg">
          {isPostIncident
            ? "Update appointment with post-visit details"
            : "Create a new appointment for patient care"}
        </p>
      </motion.div>

      {/* Show available appointments for post-incident if not editing */}
      {!isPostIncident && patientAppointments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl mb-6"
        >
          <div className="bg-slate-800/50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Scheduled Appointments - Ready for Completion
            </h2>
            <div className="grid gap-3">
              {patientAppointments?.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-slate-700/30 rounded-lg p-4 border border-slate-600"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-100">
                        {appointment.title}
                      </h3>
                      <p className="text-slate-300 text-sm mt-1">
                        {appointment.description}
                      </p>
                      <p className="text-slate-400 text-xs mt-1">
                        Scheduled:{" "}
                        {new Date(
                          appointment.appointmentDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <motion.button
                      onClick={() => handleEditAppointment(appointment.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Complete Visit
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        className="w-full max-w-2xl bg-slate-800/50 p-6 rounded-lg"
        layout
      >
        {/* Pre-Appointment Form */}
        {!isPostIncident && (
          <form className="space-y-6" onSubmit={handleSavePreAppointment}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={preAppointmentForm.title}
                  onChange={handlePreAppointmentChange}
                  placeholder="Root Canal Treatment, Dental Cleaning, Emergency Visit etc"
                  className={`w-full px-4 py-3 bg-slate-700/30 border rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.title ? "border-red-500" : "border-slate-600"
                  }`}
                />
                {errors.title && (
                  <p className="text-red-400 text-sm mt-1">{errors.title}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={preAppointmentForm.description}
                  onChange={handlePreAppointmentChange}
                  placeholder="Detailed reason for visit, symptoms, or concerns"
                  className={`w-full px-4 py-3 bg-slate-700/30 border rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                    errors.description ? "border-red-500" : "border-slate-600"
                  }`}
                />
                {errors.description && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Comments
                </label>
                <textarea
                  name="comments"
                  value={preAppointmentForm.comments}
                  onChange={handlePreAppointmentChange}
                  rows={3}
                  placeholder="Doctor's notes, patient concerns, preparation instructions etc"
                  className={`w-full px-4 py-3 bg-slate-700/30 border rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                    errors.comments ? "border-red-500" : "border-slate-600"
                  }`}
                />
                {errors.comments && (
                  <p className="text-red-400 text-sm mt-1">{errors.comments}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Appointment Date
                </label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={preAppointmentForm.appointmentDate}
                  onChange={handlePreAppointmentChange}
                  className={`w-full px-4 py-3 bg-slate-700/30 border rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.appointmentDate
                      ? "border-red-500"
                      : "border-slate-600"
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
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
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
            </div>
          </form>
        )}

        {/* Post-Appointment Form */}
        {isPostIncident && (
          <form className="space-y-6" onSubmit={handleSavePostAppointment}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Treatment Cost ($)
                </label>
                <input
                  type="number"
                  name="cost"
                  min="0"
                  step="0.01"
                  value={postAppointmentForm.cost}
                  onChange={handlePostAppointmentChange}
                  placeholder="Enter treatment cost"
                  className={`w-full px-4 py-3 bg-slate-700/30 border rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.cost ? "border-red-500" : "border-slate-600"
                  }`}
                />
                {errors.cost && (
                  <p className="text-red-400 text-sm mt-1">{errors.cost}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Treatment Details
                </label>
                <textarea
                  name="treatment"
                  rows={4}
                  value={postAppointmentForm.treatment}
                  onChange={handlePostAppointmentChange}
                  placeholder="Describe the treatment provided, procedures performed, medications prescribed, etc."
                  className={`w-full px-4 py-3 bg-slate-700/30 border rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                    errors.treatment ? "border-red-500" : "border-slate-600"
                  }`}
                />
                {errors.treatment && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.treatment}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Treatment Status
                </label>
                <select
                  name="status"
                  value={postAppointmentForm.status}
                  onChange={handlePostAppointmentChange}
                  className={`w-full px-4 py-3 bg-slate-700/30 border rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.status ? "border-red-500" : "border-slate-600"
                  }`}
                >
                  <option value="completed">Completed</option>
                  <option value="partial">Partially Completed</option>
                  <option value="follow-up-required">Follow-up Required</option>
                  <option value="referred">Referred to Specialist</option>
                </select>
                {errors.status && (
                  <p className="text-red-400 text-sm mt-1">{errors.status}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Next Appointment Date (Optional)
                </label>
                <input
                  type="date"
                  name="nextDate"
                  value={postAppointmentForm.nextDate}
                  onChange={handlePostAppointmentChange}
                  className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Upload Files (Optional)
                </label>
                <input
                  type="file"
                  name="files"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handlePostAppointmentChange}
                  className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600 rounded-lg text-slate-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
                <p className="text-slate-400 text-xs mt-1">
                  Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
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
                  <FileText size={18} />
                )}
                Complete Appointment
              </motion.button>
              <motion.button
                type="button"
                onClick={handleCancelEdit}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700/50 transition-colors font-medium"
              >
                Cancel
              </motion.button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default PreAppointment;
