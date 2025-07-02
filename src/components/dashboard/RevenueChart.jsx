import React from "react";
import { LineChart } from '@mui/x-charts/LineChart';


const RevenueChart = () => {
  return (
    <div className= "group cursor-pointer bg-slate-200/70 rounded-lg p-0  backdrop-blur-md  border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
      <LineChart
      xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
      series={[
        {
          data: [2, 5.5, 2, 8.5, 1.5, 5],
        },
      ]}
      height={400}
      grid={{ vertical: true, horizontal: true }}
      className="text-white"
    />
    </div>
  );
};

export default RevenueChart;
