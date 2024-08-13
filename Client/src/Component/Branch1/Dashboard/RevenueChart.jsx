// src/components/RevenueChart.jsx
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import './RevenueChart.css';  // Import the CSS file

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RevenueChart = () => {
  const [revenueData, setRevenueData] = useState({ onlineSales: 0, offlineSales: 0 });

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/revenue');
        setRevenueData(response.data);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      }
    };

    fetchRevenueData();
  }, []);

  const data = {
    labels: ['Today'],
    datasets: [
      {
        label: 'UPI',
        data: [revenueData.onlineSales],
        backgroundColor: 'rgb(219, 136, 42)', 
      },
      {
        label: 'Cash',
        data: [revenueData.offlineSales],
        backgroundColor: 'rgb(220, 167, 107)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Total Revenue',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value / 1000}k`,
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <h2 className="chart-title">Total Revenue</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default RevenueChart;
