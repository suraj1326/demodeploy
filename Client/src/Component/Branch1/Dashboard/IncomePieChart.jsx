import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import './IncomePieChart.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const IncomePieChart = ({ title }) => {
  const [data, setData] = useState({ spent: 0, left: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3000/api/income-data')
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the income data!', error);
        setLoading(false);
      });
  }, []);

  const totalIncome = data.spent + data.left; // Calculate total income

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: `${title} ${totalIncome >= 0 ? 'Loss' : 'Profit'} ${Math.abs(totalIncome)}`,
      },
    },
  };

  const chartData = {
    labels: ['Purchase', 'Sale'],
    datasets: [
      {
        label: 'Amount',
        data: [data.spent, data.left],
        backgroundColor: ['#80bfff', '#0080ff'],
        hoverBackgroundColor: ['#99ccff', '#3399ff'],
        borderWidth: 1,
      },
    ],
  };

  const formattedLeft = data.left >= 0 ? `+${data.left}` : data.left;

  return (
    <div className="pie-chart-container">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Doughnut data={chartData} options={options} />
          <div className="pie-chart-legend">
            <div>
              <span className="legend-color" style={{ backgroundColor: '#80bfff' }}></span> Purchase {data.spent}
            </div>
            <div>
              <span className="legend-color" style={{ backgroundColor: '#0080ff' }}></span> Sale {formattedLeft}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default IncomePieChart;
