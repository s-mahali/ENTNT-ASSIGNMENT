import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Search, AlertTriangle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setPatientUsers } from "../../redux/slicers/patientSlice";
import AddPatientForm from "./AddPatientForm";
import PatientTable from "./PatientTable";
import toast from "react-hot-toast";

const ManagePatient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { patients } = useSelector((store) => store.patients);

  const getPatientsFromStorage = () => {
    try {
      const stored = localStorage.getItem("patients");
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed ? parsed : [];
      }
      return [];
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return [];
    }
  };

  const savePatientsToStorage = (patientsData) => {
    try {
      localStorage.setItem("patients", JSON.stringify(patientsData || []));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
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
      //check for same month and day of birth then subtract one year
      age--;
    }
    return age;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  //fetch-all-patients
  useEffect(() => {
    const fetchAllPatient = async () => {
      setIsLoading(true);
      try {
        // simulate api delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const patientsData = getPatientsFromStorage();
        dispatch(setPatientUsers(patientsData));
        
      } catch (error) {
        console.error("Error while fetching patients:", error.message);
        dispatch(setPatientUsers([]));
        savePatientsToStorage([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllPatient();
  }, [dispatch]);

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setIsEditing(true);
  };

  const handleView = (patient) => {
    setSelectedPatient(patient);
    setViewModalOpen(true);
  };

  const handleDelete = (patient) => {
    setSelectedPatient(patient);
    setDeleteModalOpen(true);
  };

  const handleSave = (patient) => {
    const updatePatients = patients.map((p) =>
      p.id === patient.id ? patient : p
    );
    dispatch(setPatientUsers(updatePatients));
    savePatientsToStorage(updatePatients);
    setSelectedPatient(patient);
    setIsEditing(false);
  };

  const handleAddSave = (newPatient) => {
    const updatedPatients = [...patients, newPatient];
    dispatch(setPatientUsers(updatedPatients));
    savePatientsToStorage(updatedPatients);
    setSelectedPatient(newPatient);
    setIsAdding(false);
  };

  const confirmDelete = () => {
    if (patients && patients.length > 0) {
      const updatedPatients = patients.filter(
        (p) => p.id !== selectedPatient.id
      );
      dispatch(setPatientUsers(updatedPatients));
      savePatientsToStorage(updatedPatients);
      setSelectedPatient(null);
      toast.success("Patient deleted successfully");
    }
    setDeleteModalOpen(false);
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setSelectedPatient(null);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4">
            Patient Management
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Manage your patients efficiently with our comprehensive system
          </p>
        </motion.div>

        {/* Search and Add */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center"
        >
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <motion.button
            onClick={handleAdd}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg"
          >
            <Plus size={20} />
            Add Patient
          </motion.button>
        </motion.div>

        {/* Patient Table */}
        {isLoading ? (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-12 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-slate-300">Loading patients...</p>
          </div>
        ) : (
          <PatientTable
            patients={patients || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            searchTerm={searchTerm}
            calculateAge={calculateAge}
          />
        )}

        {/* View Patient Modal */}
        <AnimatePresence>
          {viewModalOpen && selectedPatient && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setViewModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-800/95 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 max-w-2xl w-full max-h-[90vh] overflow-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-100">
                    Patient Details
                  </h3>
                  <button
                    onClick={() => setViewModalOpen(false)}
                    className="text-slate-400 hover:text-slate-100 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-slate-400 mb-1">
                        Full Name
                      </h4>
                      <p className="text-slate-100">{selectedPatient.name}</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-slate-400 mb-1">
                        Age
                      </h4>
                      <p className="text-slate-100">
                        {calculateAge(selectedPatient.dob)} years
                      </p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-slate-400 mb-1">
                        Date of Birth
                      </h4>
                      <p className="text-slate-100">
                        {formatDate(selectedPatient.dob)}
                      </p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-slate-400 mb-1">
                        Contact
                      </h4>
                      <p className="text-slate-100">
                        {selectedPatient.contact}
                      </p>
                    </div>
                    {selectedPatient.email && (
                      <div className="bg-slate-700/30 rounded-lg p-4 md:col-span-2">
                        <h4 className="text-sm font-medium text-slate-400 mb-1">
                          Email
                        </h4>
                        <p className="text-slate-100">
                          {selectedPatient.email}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-slate-400 mb-2">
                      Health Information
                    </h4>
                    <p className="text-slate-100">
                      {selectedPatient.healthInfo}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Patient Modal */}
        <AnimatePresence>
          {isEditing && selectedPatient && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setIsEditing(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-800/95 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 max-w-2xl w-full max-h-[90vh] overflow-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-100">
                    Edit Patient
                  </h3>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-slate-400 hover:text-slate-100 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <AddPatientForm
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  selectedPatient={selectedPatient}
                  onSave={handleSave}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Patient Modal */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setIsAdding(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-800/95 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 max-w-2xl w-full max-h-[90vh] overflow-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-100">
                    Add New Patient
                  </h3>
                  <button
                    onClick={() => setIsAdding(false)}
                    className="text-slate-400 hover:text-slate-100 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <AddPatientForm
                  isAdding={isAdding}
                  setIsAdding={setIsAdding}
                  onSave={handleAddSave}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={cancelDelete}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-800/95 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 max-w-md w-full"
              >
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle size={24} className="text-amber-500" />
                  <h3 className="text-xl font-bold text-slate-100">
                    Confirm Delete
                  </h3>
                </div>

                {selectedPatient && (
                  <div className="mb-6">
                    <p className="text-slate-300 mb-4">
                      Are you sure you want to delete this patient?
                    </p>
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-slate-100 mb-2">
                        {selectedPatient.name}
                      </h4>
                      <p className="text-sm text-slate-400 mb-1">
                        Contact: {selectedPatient.contact}
                      </p>
                      <p className="text-sm text-slate-400">
                        DOB: {formatDate(selectedPatient.dob)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={cancelDelete}
                    className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700/50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200"
                  >
                    Delete Patient
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ManagePatient;
