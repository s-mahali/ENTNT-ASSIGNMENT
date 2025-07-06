import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setPatientUsers } from "../../redux/slicers/patientSlice";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Save, Loader2 } from "lucide-react";
import { setAuthUser } from "../../redux/slicers/authSlice";

const AddPatientForm = ({
  isEditing,
  isAdding,
  setIsAdding,
  setIsEditing,
  selectedPatient,
  onSave,
  
}) => {
  //const isUser = true;
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    dob: "",
    contact: "",
    healthInfo: "",
    id: `p${Date.now()}`,
  });
  const { patients } = useSelector((store) => store.patients);
  const { user } = useSelector((store) => store.auth);
  console.log("user", user);
  const dispatch = useDispatch();

  const savePatientsToStorage = (patientsData) => {
    try {
      localStorage.setItem("patients", JSON.stringify(patientsData || []));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  useEffect(() => {
    if (isEditing && selectedPatient) {
      setAddForm({ ...selectedPatient });
    } else if (isAdding) {
      setAddForm({
        name: "",
        dob: "",
        contact: "",
        healthInfo: "",
        id: `p${Date.now()}`,
      });
    }

    if(user.role === "user"){
      setIsUser(true);
    }


    
  }, [isEditing, isAdding, selectedPatient]);

  const handleInputChange = (e) => {
    setAddForm({
      ...addForm,
      [e.target.name]: e.target.value,
    });

    //clear error when start typing
    if (errors[e.target.name]) {
      setErrors((prev) => ({
        ...prev,
        [e.target.name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!addForm.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!addForm.dob) {
      newErrors.dob = "Date of Birth is required";
    }
    if (!addForm.contact.trim()) {
      newErrors.contact = "Contact is required";
    }
    if (!addForm.healthInfo.trim()) {
      newErrors.healthInfo = "Health Information is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSave = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setIsLoading(true);
    try {
      // simulate api delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (isEditing) {
        // Update existing patient
        const updatedPatients = patients.map((p) =>
          p.id === addForm.id ? addForm : p
        );
        dispatch(setPatientUsers(updatedPatients));
        savePatientsToStorage(updatedPatients);
        toast.success("Patient updated successfully");
        setIsEditing(false);
        if (onSave) onSave(addForm);
      } else {
        // Add new patient
        let newPatient;
        newPatient = { ...addForm, id: `p${Date.now()}` };

        const updatedPatients = [...patients, newPatient];
        dispatch(setPatientUsers(updatedPatients));
        savePatientsToStorage(updatedPatients);
        isUser ?  null : setIsAdding(false) 

        if (isUser) {
          const updateUser = { ...user, pateintId: newPatient.id };
          localStorage.setItem("user-cred", JSON.stringify(updateUser));
          dispatch(setAuthUser(updateUser));
          
        }
        toast.success("Patient added successfully");

        if (onSave) onSave(newPatient);
      }

      // Reset form
      setAddForm({
        name: "",
        dob: "",
        contact: "",
        healthInfo: "",
        id: `p${Date.now()}`,
      });
      setErrors({});
    } catch (error) {
      console.error("Error while saving patient:", error.message);
      toast.error(
        isEditing ? "Failed to update patient" : "Failed to add patient"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleAddSave} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={addForm.name}
            onChange={handleInputChange}
            placeholder="Enter patient's full name"
            className={`w-full px-4 py-3 bg-slate-700/30 border rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.name ? "border-red-500" : "border-slate-600"
            }`}
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            name="dob"
            value={addForm.dob}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-slate-700/30 border rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.dob ? "border-red-500" : "border-slate-600"
            }`}
          />
          {errors.dob && (
            <p className="text-red-400 text-sm mt-1">{errors.dob}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Contact Number
          </label>
          <input
            type="tel"
            name="contact"
            value={addForm.contact}
            onChange={handleInputChange}
            placeholder="Enter contact number"
            className={`w-full px-4 py-3 bg-slate-700/30 border rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.contact ? "border-red-500" : "border-slate-600"
            }`}
          />
          {errors.contact && (
            <p className="text-red-400 text-sm mt-1">{errors.contact}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Health Information
          </label>
          <textarea
            name="healthInfo"
            value={addForm.healthInfo}
            onChange={handleInputChange}
            rows={4}
            placeholder="Medical conditions, allergies, medications, etc."
            className={`w-full px-4 py-3 bg-slate-700/30 border rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
              errors.healthInfo ? "border-red-500" : "border-slate-600"
            }`}
          />
          {errors.healthInfo && (
            <p className="text-red-400 text-sm mt-1">{errors.healthInfo}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
          {isLoading
            ? isEditing
              ? "Updating..."
              : "Saving..."
            : isEditing
            ? "Update Patient"
            : "Save Patient"}
        </motion.button>

        <motion.button
          type="button"
          onClick={() => {
            setIsEditing(false);
            setIsAdding(false);
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
  );
};

export default AddPatientForm;
