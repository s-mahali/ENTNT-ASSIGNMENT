import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate} from "react-router-dom";


const ProtectedRoute = ({ children, role }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user-cred"));
  useEffect(() => {
    
    if(!user){
       navigate("/login")
    }
    if(role === "admin" && user.role !== "admin"){
        navigate("/dashboard")
    }
    if(role === 'user' && user.role !== "user"){
           navigate("/admindashboard")
    }
  },[navigate, user])
  

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }
  return children;
   
};

export default ProtectedRoute;