import React, { useEffect } from "react";
import { useNavigate} from "react-router-dom";


const ProtectedRoute = ({ children, role }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user-cred"));
    if(!user){
       navigate("/")
    }
    if(role === "admin" && user.role !== "admin"){
        navigate("/dashboard")
    }
    if(role === 'user' && user.role !== "user"){
           navigate("/admindashboard")
    }
  },[navigate])

 
  return children;
};

export default ProtectedRoute;