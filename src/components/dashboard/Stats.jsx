import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
} from "lucide-react";
const Stats = () => {
  const [statsData, setStatsData] = useState({
    totalRevenue: 0,
    totalPatients: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
    averageCost: 50,
    monthlyGrowth: 12.6,
  });

  useEffect(() => {
    const existingAppointments = JSON.parse(
      localStorage.getItem("appointments") || "[]"
    );
    const patients = JSON.parse(localStorage.getItem("patients") || "[]");
    setStatsData((prevStats) => ({
      ...prevStats,
      totalRevenue: existingAppointments.reduce(
        (total, app) => total + Number(app.cost|| 0),
        0
      ),
      totalPatients: patients.length,
      completedAppointments: existingAppointments.filter(
        (app) => app.status === "completed"
      ).length,
      pendingAppointments: existingAppointments.filter(
        (app) => app.status === "scheduled"
      ).length,
    }));
  }, []);
  return (
    <div className="w-full p-4 md:p-6">
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
        Dashboard Stats
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Revenue Card */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Total Revenue
              </p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                ${parseInt(statsData.totalRevenue)}
              </h3>
            </div>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
              <DollarSign
                size={20}
                className="text-emerald-600 dark:text-emerald-400"
              />
            </div>
          </div>
          <div className="flex items-center text-xs">
            <TrendingUp size={14} className="mr-1 text-emerald-500" />
            <span className="text-emerald-500 font-medium">
              {statsData.monthlyGrowth}%
            </span>
            <span className="text-slate-400 dark:text-slate-500 ml-1">
              from last month
            </span>
          </div>
        </div>

        {/* Patients Card */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Total Patients
              </p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {statsData.totalPatients}
              </h3>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Users size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500">
            Active patients in database
          </div>
        </div>

        {/* Average Treatment Cost */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Average Treatment Cost
              </p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                ${statsData.averageCost}
              </h3>
            </div>
            <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-full">
              <DollarSign
                size={20}
                className="text-violet-600 dark:text-violet-400"
              />
            </div>
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500">
            Based on last 30 days
          </div>
        </div>

        {/* Appointments Status Card */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 md:col-span-2 lg:col-span-3">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
              Appointment Status
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
              <div className="p-2 mr-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                <CheckCircle
                  size={18}
                  className="text-emerald-600 dark:text-emerald-400"
                />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Completed Treatments
                </p>
                <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  {statsData.completedAppointments}
                </p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
              <div className="p-2 mr-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                <Clock
                  size={18}
                  className="text-amber-600 dark:text-amber-400"
                />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pending Treatments
                </p>
                <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  {statsData.pendingAppointments}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
