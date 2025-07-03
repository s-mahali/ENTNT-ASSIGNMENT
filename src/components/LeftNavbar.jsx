import React from "react";
import { useNavigate } from "react-router-dom";
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

const LeftNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sidebarItems = [
    {
      icon: <LayoutDashboard />,
      text: "adminDashboard",
    },

    {
      icon: <Bandage />,
      text: "patients",
    },
    {
      icon: <BriefcaseMedical />,
      text: "appointments",
    },
    {
      icon: <UserRound />,
      text: "userDashboard",
    },

    {
      icon: <LogOut />,
      text: "Logout",
    },
  ];

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
      case "userDashboard":
        navigate("/userDashboard");
        break;
      default:
        break;
    }
  };

  return (
    <div className="fixed top-0 left-0 z-10 px-4 w-[16] h-screen bg-[#1d3057]">
      <div className="flex flex-col">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center  my-8 mx-auto">
          <Stethoscope className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col  items-center ">
          {sidebarItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 relative text-slate-100 hover:bg-gray-700 cursor-pointer rounded-lg p-3 my-3"
              onClick={() => handleNavbar(item.text)}
            >
              {item.icon}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeftNavbar;
