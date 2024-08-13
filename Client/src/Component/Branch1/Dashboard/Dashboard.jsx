// src/components/Dashboard.jsx
import React from 'react';
import RevenueChart from "./RevenueChart";
import SalesSummary from "./SalesSummary"
import IncomePieChart from './IncomePieChart';
// import './Dashboard.css';






const Dashboard = () => {
  return (
    <div>

      
      <RevenueChart />
      <SalesSummary />
      <div className="pie-charts">
      <IncomePieChart className="daily"  title="Daily Income" totalIncome="5000" spent={2000} left={3000} />
      
      
      
    </div>

     

    </div>
  );
};

export default Dashboard;
