import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  Calendar,
  Heart,
  Edit,
  Trash2,
  Plus,
  X,
  Search,
  AlertTriangle
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setPatientUsers } from "../../redux/slicers/patientSlice";
import AddPatientForm from "./AddPatientForm";
import toast from "react-hot-toast";

// const patientData = [
//   {
//     id: "p1",
//     name: "John Doe",
//     dob: "1990-05-10",
//     contact: "1234567890",
//     healthInfo: "No allergies",
//   },
//   {
//     id: "p2",
//     name: "Eren Yeager",
//     dob: "1985-08-22",
//     contact: "9876543210",
//     healthInfo: "Diabetes Type 2, High blood pressure",
//   },
//   {
//     id: "p3",
//     name: "Mikasa Ackerman",
//     dob: "1978-12-15",
//     contact: "5555551234",
//     healthInfo: "Allergic to penicillin",
//   },
//   {
//     id: "p4",
//     name: "Horikita san",
//     dob: "1992-03-08",
//     contact: "7777778888",
//     healthInfo: "Asthma, seasonal allergies",
//   },
//   {
//     id: "p5",
//     name: "Lata Kumari",
//     dob: "1965-11-30",
//     contact: "3333334444",
//     healthInfo: "Heart condition, takes blood thinners",
//   },
//   {
//     id: "p6",
//     name: "Harshit Sharma",
//     dob: "1988-07-12",
//     contact: "6666667777",
//     healthInfo: "No known medical conditions",
//   },
// ];

const ManagePatient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
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

  // const formatPhone = (phone) => {
  //   const cleaned = phone.replace(/\D/g, "");
  //   const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  //   if (match) {
  //     return `(${match[1]}) ${match[2]}-${match[3]}`;
  //   }
  //   return phone;
  // };

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    setIsEditing(false);
    setIsAdding(false);
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
        console.log("Loaded patients from localStorage:", patientsData);
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

  const handleEdit = () => {
    setEditForm({ ...selectedPatient });
    setIsEditing(true);
  };

  const handleSave = (updatePatient) => {
    const updatePatients = patients.map((p) =>
      p.id === updatePatient.id ? updatePatient : p
    );
    dispatch(setPatientUsers(updatePatients));
    savePatientsToStorage(updatePatients);
    setSelectedPatient(updatePatient);
    setIsEditing(false);
  };

  const handleAddSave = (newPatient) => {
    const updatedPatients = [...patients, newPatient];
    dispatch(setPatientUsers(updatedPatients));
    savePatientsToStorage(updatedPatients);
    setSelectedPatient(newPatient);
    setIsAdding(false);
  };

  const handleDelete = () => {
    setDeleteModalOpen(true);
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

  const filteredPatients =
    patients &&
    patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.contact.includes(searchTerm)
    );

  //framer-motion helper function
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const sidebarVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200,
      },
    },
    exit: {
      x: "100%",
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
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

        <div className="flex gap-8">
          {/* Patient Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 animate-pulse">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-slate-700 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-700 rounded w-24"></div>
                        <div className="h-3 bg-slate-700 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-700 rounded w-32"></div>
                      <div className="h-3 bg-slate-700 rounded w-28"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {patients && patients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <motion.div
                      key={patient.id}
                      variants={cardVariants}
                      whileHover={{ y: -5, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePatientClick(patient)}
                      className={`cursor-pointer bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border transition-all duration-300 ${
                        selectedPatient?.id === patient.id
                          ? 'border-blue-500 bg-blue-900/20'
                          : 'border-slate-700/50 hover:border-slate-600/50'
                      }`}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                          <User size={24} className="text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-100">
                            {patient.name}
                          </h3>
                          <p className="text-sm text-slate-400">
                            Age {calculateAge(patient.dob)}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Phone size={16} className="text-blue-400" />
                          {patient.contact}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Calendar size={16} className="text-blue-400" />
                          {formatDate(patient.dob)}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-700/50">
                        <div className="flex items-start gap-2">
                          <Heart size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-slate-300 line-clamp-2">
                            {patient.healthInfo}
                          </p>
                          
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-16">
                    <User size={64} className="text-slate-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-100 mb-2">
                      No Patients Found
                    </h3>
                    <p className="text-slate-400">
                      Add your first patient to get started
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Patient Details Sidebar */}
          <AnimatePresence>
            {(selectedPatient || isAdding) && (
              <motion.div
                variants={sidebarVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-96 bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 sticky top-8 self-start"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-100">
                    {isAdding ? "Add New Patient" : "Patient Details"}
                  </h2>
                  <button
                    onClick={() => {
                      setSelectedPatient(null);
                      setIsAdding(false);
                      setIsEditing(false);
                    }}
                    className="text-slate-400 hover:text-slate-100 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {isEditing || isAdding ? (
                  <AddPatientForm
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    isAdding={isAdding}
                    setIsAdding={setIsAdding}
                    selectedPatient={selectedPatient}
                    onSave={isEditing ? handleSave : handleAddSave}
                  />
                ) : (
                  <div>
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User size={32} className="text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-100 mb-1">
                        {selectedPatient.name}
                      </h3>
                      <p className="text-slate-400">
                        Age {calculateAge(selectedPatient.dob)}
                      </p>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Calendar size={20} className="text-blue-400" />
                          <span className="text-slate-300 font-medium">Date of Birth</span>
                        </div>
                        <p className="text-slate-100 ml-8">
                          {formatDate(selectedPatient.dob)}
                        </p>
                      </div>

                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Phone size={20} className="text-blue-400" />
                          <span className="text-slate-300 font-medium">Contact</span>
                        </div>
                        <p className="text-slate-100 ml-8">
                          {selectedPatient.contact}
                        </p>
                      </div>

                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Heart size={20} className="text-red-400" />
                          <span className="text-slate-300 font-medium">Health Information</span>
                        </div>
                        <p className="text-slate-100 ml-8">
                          {selectedPatient.healthInfo}
                        </p>
                        
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <motion.button
                        onClick={handleEdit}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                      >
                        <Edit size={16} />
                        Edit
                      </motion.button>
                      <motion.button
                        onClick={handleDelete}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
                  <h3 className="text-xl font-bold text-slate-100">Confirm Delete</h3>
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
