import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
// import Chart from 'chart.js/auto';

const AnimatedDashboard = () => {
  const [dataPoints, setDataPoints] = useState([]);
  const [labels, setLabels] = useState([]);

  const socket = new WebSocket("ws://localhost:6789"); // Adjust the WebSocket URL as needed

  useEffect(() => {
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setDataPoints((prev) => [...prev, data.data_rate]);
      setLabels((prev) => [...prev, new Date(data.timestamp).toLocaleTimeString()]);

      // Limit the number of data points
      if (dataPoints.length > 10) {
        setDataPoints((prev) => prev.slice(1));
        setLabels((prev) => prev.slice(1));
      }
    };

    return () => {
      socket.close();
    };
  }, [dataPoints]);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Data Rate (Mbps)',
        data: dataPoints,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Real-Time Data Monitoring</h1>
      <div className="w-full max-w-4xl">
        <Line data={chartData} />
      </div>
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Server Node</h2>
        <div className="flex justify-center mt-5">
          <div className="bg-blue-500 w-20 h-20 rounded-full flex items-center justify-center text-white font-bold">
            Server
          </div>
        </div>
        {/* Nodes representing different traffic sources */}
        <div className="flex justify-around mt-10">
          {['Instagram', 'WhatsApp', 'YouTube', 'Voice Call'].map((service) => (
            <div
              key={service}
              className="node bg-green-500 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold animate-pulse"
            >
              {service}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimatedDashboard;
