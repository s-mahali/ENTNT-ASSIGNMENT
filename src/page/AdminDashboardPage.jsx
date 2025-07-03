import {useState} from "react";
import TopPatients from "../components/dashboard/TopPatients";
import NextAppointment from "../components/dashboard/NextAppointment";
import Stats from "../components/dashboard/Stats";
import RevenueChart from "../components/dashboard/RevenueChart";

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('calendar');

  const tabs = [
    { id: 'calendar', label: 'calendar' },
    { id: 'treatment', label: 'treatment' },
    { id: 'patientList', label: 'patientList' }
  ];
  return (
     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex flex-col">
      {/* Tab Navigation */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-8 justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'text-white border-b-2 border-blue-400 pb-2'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className=" w-full max-w-7xl mx-auto   p-4 md:p-6  ">
        <div className="grid grid-cols-1 lg:grid-cols-2  gap-6">
          {/* Left Section */}
                <div className="space-y-6">
                
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
              <Stats />
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg">
              <RevenueChart />
            </div>
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
