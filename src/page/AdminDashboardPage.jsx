import { useState } from "react";
import TopPatients from "../components/dashboard/TopPatients";
import NextAppointment from "../components/dashboard/NextAppointment";
import Stats from "../components/dashboard/Stats";
import RevenueChart from "../components/dashboard/RevenueChart";
import Calender from "../components/dashboard/Calender";

const AdminDashboardPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex flex-col">
      {/* Main Content */}
      <div className=" w-full max-w-7xl mx-5 sm:mx-auto  p-4 md:p-6  ">
        <div className="flex flex-col  gap-6">
          {/* Left Section */}
          <div className=" space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg">
              <Stats />
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg h-[400px] overflow-hidden">
              <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                <TopPatients />
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg h-[400px] overflow-hidden">
              <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                <NextAppointment />
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="space-y-6 ">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg">
              <RevenueChart />
            </div>
          </div>
          <div className="space-y-6">
            <Calender />
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgb(30 41 59);
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgb(71 85 105);
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgb(100 116 139);
        }
      `}</style>
    </div>
  );
};

export default AdminDashboardPage;
