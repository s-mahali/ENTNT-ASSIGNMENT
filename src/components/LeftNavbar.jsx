import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setAuthUser } from "../redux/slicers/authSlice";
import { useDispatch } from "react-redux";
import {
  LayoutDashboard,
  Bandage,
  BriefcaseMedical,
  UserRound,
  LogOut,
  Stethoscope,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Tooltip from "@mui/material/Tooltip";
import { setPatientUsers } from "../redux/slicers/patientSlice";

const LeftNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user-cred" || []));
  const [role, setRole] = useState("user");
  useEffect(() => {
    if (user && user.role === "admin") {
      setRole("admin");
    } else {
      setRole("user");
    }
  }, [role, user]);

  let sidebarItems;

  if (role === "admin") {
    sidebarItems = [
      {
        icon: <LayoutDashboard />,
        text: "Admin Dashboard",
        nav: "adminDashboard",
      },
      {
        icon: <Bandage />,
        text: "Patients",
        nav: "patients",
      },
      {
        icon: <BriefcaseMedical />,
        text: "Appointments",
        nav: "appointments",
      },
      {
        icon: <LogOut />,
        text: "Logout",
        nav: "Logout",
      },
    ];
  } else {
    sidebarItems = [
      {
        icon: <UserRound />,
        text: "User Dashboard",
        nav: "userdashboard",
      },
      {
        icon: <LogOut />,
        text: "Logout",
        nav: "Logout",
      },
    ];
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem("user-cred");
      dispatch(setAuthUser(null));
      navigate("/login");
      toast.success("Logout successful");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const handleNavbar = (textType) => {
    switch (textType) {
      case "Logout":
        handleLogout();
        break;
      case "adminDashboard":
        navigate("/admindashboard");
        break;
      case "patients":
        navigate("/patients");
        break;
      case "appointments":
        navigate("/appointments");
        break;
      case "userdashboard":
        navigate("/dashboard");
        break;
      default:
        break;
    }
  };

  return (
    <nav>
      {/* Desktop sidebar */}
      <div className="hidden md:flex fixed top-0 left-0 z-10 px-4 w-16 h-screen bg-[#1d3057] flex-col">
        <div className="flex flex-col">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center my-8 mx-auto">
            <Link to="/">
              <Stethoscope className="w-6 h-6 text-white" />
            </Link>
          </div>
          <div className="flex flex-col items-center">
            {sidebarItems.map((item, index) => (
              <Tooltip title={item.text} placement="right" arrow key={index}>
                <div
                  className="flex items-center gap-3 relative text-slate-100 hover:bg-gray-700 cursor-pointer rounded-lg p-3 my-3"
                  onClick={() => handleNavbar(item.nav)}
                >
                  {item.icon}
                </div>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
      {/* Mobile bottom navbar */}
      <div className="md:hidden fixed bottom-0 left-0 z-10 w-full bg-[#1d3057] flex justify-around items-center py-2 border-t border-slate-800">
        {sidebarItems.map((item, index) => (
          <Tooltip title={item.text} placement="top" arrow key={index}>
            <div
              className="flex flex-col items-center text-slate-100 hover:bg-gray-700 cursor-pointer rounded-lg p-2"
              onClick={() => handleNavbar(item.nav)}
            >
              {item.icon}
            </div>
          </Tooltip>
        ))}
      </div>
    </nav>
  );
};

export default LeftNavbar;