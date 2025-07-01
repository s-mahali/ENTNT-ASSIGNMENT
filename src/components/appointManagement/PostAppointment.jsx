import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Loader2 } from 'lucide-react'

const PostAppointment = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [postAppointmentForm, setPostAppointmentForm] = useState({
        appointmentId: "",
        treatmentProvided: "",
        notes: "",
        followUpRequired: false,
        followUpDate: "",
        medicationsPrescribed: "",
        status: "completed"
    });

    useEffect(() => {
        // Load scheduled appointments
        const savedAppointments = JSON.parse(localStorage.getItem("appointments") || "[]");
        const scheduledAppointments = savedAppointments.filter(apt => apt.status === "scheduled");
        setAppointments(scheduledAppointments);
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPostAppointmentForm({
            ...postAppointmentForm,
            [name]: type === 'checkbox' ? checked : value,
        });

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleAppointmentSelect = (appointmentId) => {
        const appointment = appointments.find(apt => apt.id === appointmentId);
        setSelectedAppointment(appointment);
        setPostAppointmentForm({
            ...postAppointmentForm,
            appointmentId: appointmentId
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!postAppointmentForm.appointmentId) {
            newErrors.appointmentId = "Please select an appointment";
        }
        if (!postAppointmentForm.treatmentProvided.trim()) {
            newErrors.treatmentProvided = "Treatment provided is required";
        }
        if (!postAppointmentForm.notes.trim()) {
            newErrors.notes = "Notes are required";
        }
        if (postAppointmentForm.followUpRequired && !postAppointmentForm.followUpDate) {
            newErrors.followUpDate = "Follow-up date is required when follow-up is needed";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setIsLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            
            // Get all appointments
            const allAppointments = JSON.parse(localStorage.getItem("appointments") || "[]");
            
            // Update the selected appointment
            const updatedAppointments = allAppointments.map(apt => {
                if (apt.id === postAppointmentForm.appointmentId) {
                    return {
                        ...apt,
                        status: postAppointmentForm.status,
                        treatmentProvided: postAppointmentForm.treatmentProvided,
                        postVisitNotes: postAppointmentForm.notes,
                        followUpRequired: postAppointmentForm.followUpRequired,
                        followUpDate: postAppointmentForm.followUpDate,
                        medicationsPrescribed: postAppointmentForm.medicationsPrescribed,
                        completedAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    };
                }
                return apt;
            });
            
            // Save back to localStorage
            localStorage.setItem("appointments", JSON.stringify(updatedAppointments));
            
            // Reset form and update local state
            setPostAppointmentForm({
                appointmentId: "",
                treatmentProvided: "",
                notes: "",
                followUpRequired: false,
                followUpDate: "",
                medicationsPrescribed: "",
                status: "completed"
            });
            setSelectedAppointment(null);
            setErrors({});
            
            // Refresh appointments list
            const remainingScheduled = updatedAppointments.filter(apt => apt.status === "scheduled");
            setAppointments(remainingScheduled);
            
            alert("Post-appointment details saved successfully!");
            
        } catch (error) {
            console.error("Error updating appointment:", error);
            alert("Error saving post-appointment details");
        } finally {
            setIsLoading(false);
        }
    };
  return (
     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4">
          Complete Appointment
        </h1>
        <p className="text-slate-300">Update appointment with post-visit details</p>
      </motion.div>
      
      <motion.div className="lg:w-1/2 md:w-full sm:w-full bg-slate-800/50 p-6 rounded-lg backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Appointment Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Select Appointment to Complete
              </label>
              <select
                name="appointmentId"
                value={postAppointmentForm.appointmentId}
                onChange={(e) => handleAppointmentSelect(e.target.value)}
                className={`w-full px-4 py-3 bg-slate-700/30 border rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.appointmentId ? "border-red-500" : "border-slate-600"
                }`}
              >
                <option value="">Select an appointment...</option>
                {appointments.map((apt) => (
                  <option key={apt.id} value={apt.id}>
                    {apt.title} - {new Date(apt.appointmentDate).toLocaleDateString()}
                  </option>
                ))}
              </select>
              {errors.appointmentId && (
                <p className="text-red-400 text-sm mt-1">{errors.appointmentId}</p>
              )}
            </div>

            {/* Selected Appointment Details */}
            {selectedAppointment && (
              <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                <h3 className="text-slate-200 font-medium mb-2">Appointment Details:</h3>
                <p className="text-slate-300 text-sm"><strong>Title:</strong> {selectedAppointment.title}</p>
                <p className="text-slate-300 text-sm"><strong>Description:</strong> {selectedAppointment.description}</p>
                <p className="text-slate-300 text-sm"><strong>Date:</strong> {new Date(selectedAppointment.appointmentDate).toLocaleDateString()}</p>
              </div>
            )}

            {/* Treatment Provided */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Treatment Provided
              </label>
              <textarea
                name="treatmentProvided"
                rows={3}
                value={postAppointmentForm.treatmentProvided}
                onChange={handleInputChange}
                placeholder="Describe the treatment provided during this visit"
                className={`w-full px-4 py-3 bg-slate-700/30 border rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.treatmentProvided ? "border-red-500" : "border-slate-600"
                }`}
              />
              {errors.treatmentProvided && (
                <p className="text-red-400 text-sm mt-1">{errors.treatmentProvided}</p>
              )}
            </div>

            {/* Post-Visit Notes */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Post-Visit Notes
              </label>
              <textarea
                name="notes"
                value={postAppointmentForm.notes}
                onChange={handleInputChange}
                rows={3}
                placeholder="Patient response, complications, observations, etc."
                className={`w-full px-4 py-3 bg-slate-700/30 border rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                  errors.notes ? "border-red-500" : "border-slate-600"
                }`}
              />
              {errors.notes && (
                <p className="text-red-400 text-sm mt-1">{errors.notes}</p>
              )}
            </div>

            {/* Medications Prescribed */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Medications Prescribed
              </label>
              <textarea
                name="medicationsPrescribed"
                value={postAppointmentForm.medicationsPrescribed}
                onChange={handleInputChange}
                rows={2}
                placeholder="List any medications prescribed (optional)"
                className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              />
            </div>

            {/* Follow-up Required */}
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="followUpRequired"
                  checked={postAppointmentForm.followUpRequired}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm font-medium text-slate-200">Follow-up appointment required</span>
              </label>
            </div>

            {/* Follow-up Date */}
            {postAppointmentForm.followUpRequired && (
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Follow-up Date
                </label>
                <input
                  type="date"
                  name="followUpDate"
                  value={postAppointmentForm.followUpDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-slate-700/30 border rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.followUpDate ? "border-red-500" : "border-slate-600"
                  }`}
                />
                {errors.followUpDate && (
                  <p className="text-red-400 text-sm mt-1">{errors.followUpDate}</p>
                )}
              </div>
            )}
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
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
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
                  appointmentId: "",
                  treatmentProvided: "",
                  notes: "",
                  followUpRequired: false,
                  followUpDate: "",
                  medicationsPrescribed: "",
                  status: "completed"
                });
                setSelectedAppointment(null);
                setErrors({});
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700/50 transition-colors font-medium"
            >
              Cancel
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default PostAppointment