import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const ChartComponent = ({ selectedIndex, data }) => {
  const [selectedMetric, setSelectedMetric] = useState("open_index_value");

  const filteredData = data.filter((row) => row.index_name === selectedIndex);

  const chartData = {
    labels: filteredData.map((row) => row.index_date), // X-axis labels
    datasets: [
      {
        label: selectedMetric.replace(/_/g, " ").toUpperCase(), 
        data: filteredData.map((row) => {
          const value = row[selectedMetric];
          if (value === "NA" || value === "" || value == null) return null; 
          const cleanedValue = value.toString().replace(/,/g, ""); // Clean comma
          const parsedValue = parseFloat(cleanedValue);
          return isNaN(parsedValue) ? null : parsedValue; 
        }),
        fill: false,
        borderColor: "#007bff", // Line color
        tension: 0.2,
        pointRadius: 2,
      },
    ],
  };

  const metricsOptions = [
    "open_index_value",
    "high_index_value",
    "low_index_value",
    "closing_index_value",
    "points_change",
    "change_percent",
    "volume",
    "turnover_rs_cr",
    "pe_ratio",
    "pb_ratio",
    "div_yield",
  ];

  const handleRadioButtonChange = (metric) => {
    setSelectedMetric(metric); // Update selected metric
  };

  return (
    <div className="p-3">
      <h4 className="mb-3">{selectedIndex}</h4>

      {/* Radio Buttons for metric selection */}
      <div className="mb-3">
        <label className="form-label">Select Metric to Visualize:</label>
        <div className="d-flex flex-wrap">
          {metricsOptions.map((m) => (
            <div key={m} className="form-check me-3">
              <input
                className="form-check-input"
                type="radio"
                name="metric"
                checked={selectedMetric === m}
                onChange={() => handleRadioButtonChange(m)} 
              />
              <label className="form-check-label">
                {m.replace(/_/g, " ").toUpperCase()}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Display */}
      <div className="bg-light p-3 rounded shadow">
        {filteredData.length === 0 ? (
          <p>No data available for this company.</p> 
        ) : (
          <Line data={chartData} /> 
        )}
      </div>
    </div>
  );
};

export default ChartComponent;
