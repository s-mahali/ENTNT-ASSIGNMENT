import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Save, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";

const PreAppointment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const imgRef = useRef(null);
  const [isPostIncident, setIsPostIncident] = useState(false);
  const [preAppointmentForm, setPreAppointmentForm] = useState({
    id: `p${Date.now()}`,
    patientId: "p1751285870453",
    title: "",
    description: "",
    comments: "",
    appointmentDate: "",
    //post appointment data
    cost: "",
    treatment: "",
    status: "",
    nextDate: "",
    files: [],
  });
  const preAppointmentId = "app_1751443258737";

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

  const handleSavePostAppointment = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const existingAppointments = JSON.parse(
        localStorage.getItem("appointments") || "[]"
      );
      const preAppointment = existingAppointments.find(
        (app) => app.id === preAppointmentId
      );
      const completedAppointment = {
        ...preAppointmentForm,
        id: preAppointmentId,
        title: preAppointment.title,
        description: preAppointment.description,
        comments: preAppointment.comments,
        appointmentDate: preAppointment.appointmentDate,
        status: "completed",
        updatedAt: new Date().toISOString(),
      };
      console.log("completedAppointment", completedAppointment);
      const newAppointmentsData = existingAppointments.filter(
        (app) => app.id !== preAppointmentId
      );
      const allAppointments = [...newAppointmentsData, completedAppointment];
      saveAppointmentsToStorage(allAppointments);
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
        setPreAppointmentForm((prev) => ({
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4">
          Schedule New Incident
        </h1>
      </motion.div>
      <button onClick={() => setIsPostIncident(true)}>complete</button>
      <motion.div className="lg:w-1/2 md:w-full sm:w-full bg-slate-800/50 p-6 rounded-lg">
        <form
          className="space-y-6"
          onSubmit={
            isPostIncident
              ? handleSavePostAppointment
              : handleSavePreAppointment
          }
        >
          <div className="space-y-4">
            {!isPostIncident && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={preAppointmentForm.title}
                    onChange={handleInputChange}
                    placeholder="Root Canal Treatment, Dental Cleaning, Emergency Visit etc"
                    className={`w-full px-4 py-3 bg-slate-700/30 border rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors  ${
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
                    rows={2}
                    value={preAppointmentForm.description}
                    onChange={handleInputChange}
                    placeholder="Detailed Reason for Visit"
                    className={`w-full px-4 py-3 bg-slate-700/30 border rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
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
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Doctor's notes, patient concerns, prep instructions etc"
                    className={`w-full px-4 py-3 bg-slate-700/30 border rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                      errors.comments ? "border-red-500" : "border-slate-600"
                    }`}
                  />
                  {errors.comments && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.comments}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Appointment DateTime
                  </label>
                  <input
                    type="Date"
                    name="appointmentDate"
                    value={preAppointmentForm.appointmentDate}
                    onChange={handleInputChange}
                    placeholder="When the appointment is scheduled"
                    className={`w-full px-4 py-3 bg-slate-700/30 border rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
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
              </>
            )}
            {/* post appointment form data */}
            {isPostIncident && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Cost
                  </label>
                  <input
                    type="number"
                    name="cost"
                    value={preAppointmentForm.cost}
                    onChange={handleInputChange}
                    placeholder="Root Canal Treatment, Dental Cleaning, Emergency Visit etc"
                    className={`w-full px-4 py-3 bg-slate-700/30 border rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors  ${
                      errors.cost ? "border-red-500" : "border-slate-600"
                    }`}
                  />
                  {errors.cost && (
                    <p className="text-red-400 text-sm mt-1">{errors.cost}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Treatment
                  </label>
                  <input
                    type="text"
                    name="treatment"
                    value={preAppointmentForm.treatment}
                    onChange={handleInputChange}
                    placeholder="Root Canal Treatment, Dental Cleaning, Emergency Visit etc"
                    className={`w-full px-4 py-3 bg-slate-700/30 border rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors  ${
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
                    Next Date
                  </label>
                  <input
                    type="Date"
                    name="nextDate"
                    value={preAppointmentForm.nextDate}
                    onChange={handleInputChange}
                    placeholder=""
                    className={`w-full px-4 py-3 bg-slate-700/30 border rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors  ${
                      errors.nextDate ? "border-red-500" : "border-slate-600"
                    }`}
                  />
                  {errors.nextDate && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.nextDate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Files
                  </label>
                  <input
                    type="file"
                    name="files"
                    onChange={handleFileChange}
                    ref={imgRef}
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt,.csv"
                    placeholder="Upload files"
                    className={`w-full px-4 py-3 bg-slate-700/30 border rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors  ${
                      errors.files ? "border-red-500" : "border-slate-600"
                    }`}
                  />
                  {errors.files && (
                    <p className="text-red-400 text-sm mt-1">{errors.files}</p>
                  )}
                </div>
                {preAppointmentForm.files.length > 0 && (
                  <div className="mt-4 bg-slate-700/20 p-3 rounded-lg">
                    <p className="text-sm font-medium text-slate-200 mb-3">
                      Uploaded files ({preAppointmentForm.files.length})
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {preAppointmentForm.files.map((file, index) => (
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
                                setPreAppointmentForm((prev) => ({
                                  ...prev,
                                  files: prev.files.filter(
                                    (_, i) => i !== index
                                  ),
                                }));
                              }}
                              className="p-1 rounded-full hover:bg-slate-600/50"
                              aria-label="Remove file"
                            >
                              <X size={18} className="text-red-400" />
                            </button>
                          </div>
                          {file.url.startsWith("data:image") ? (
                            <div className="relative pt-[56.25%]">
                              <img
                                src={file.url}
                                alt={"image-preview"} 
                                className="absolute top-0 left-0 h-full w-full object-contain p-2"
                              />
                            </div>
                          ) : (
                            <div className="p-4 flex items-center justify-center bg-slate-700/30 h-24">
                              <p className="text-slate-300 text-sm">
                                {file.name}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
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
              {isPostIncident ? "Complete Appointment" : "Schedule"}
            </motion.button>

            <motion.button
              type="button"
              onClick={() => {
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
  );
};

export default PreAppointment;
