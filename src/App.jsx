import React, { useState, useEffect } from "react";
import ChartComponent from "./components/ChartComponent";

const App = () => {
  const [data, setData] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/dump.csv");
        
        if (!response.ok) {
          throw new Error(`Failed to fetch CSV: ${response.status}`);
        }

        const csvText = await response.text();
        const result = [];
        
        const rows = csvText.split('\n').filter(row => row.trim() !== '');
        
        if (rows.length < 2) {
          throw new Error("CSV file is empty or has no data rows");
        }

        const headers = rows[0].replace(/"/g, '').split(',');
        
        for (let i = 1; i < rows.length; i++) {
          const values = rows[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
                            .map(v => v.replace(/"/g, '').trim());
          
          if (values.length !== headers.length) continue;
          
          const rowData = {};
          headers.forEach((header, j) => {
            rowData[header] = values[j] || null;
          });
          result.push(rowData);
        }

        setData(result);
        
        if (result.length > 0) {
          setSelectedIndex(result[0].index_name);
        }
      } catch (error) {
        console.error("Data loading error:", error);
        alert(`Error loading data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const indexNames = [...new Set(data.map(item => item.index_name))];

  return (
    <div className="container-fluid mt-3">
      <div className="row">
        {/* Left Sidebar - Index Selection */}
        <div className="col-md-3">
          <div className="card shadow-sm h-100"> {/* Added h-100 for full height */}
            <div className="card-header bg-primary text-white sticky-top"> {/* Made header sticky */}
              <h5 className="mb-0">Select Index</h5>
            </div>
            <div className="card-body p-0">
              {loading ? (
                <div className="p-3 text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : indexNames.length > 0 ? (
                <div 
                  className="list-group list-group-flush"
                  style={{ 
                    maxHeight: "calc(100vh - 150px)", // Adjust based on your needs
                    overflowY: "auto" // Enable vertical scrolling
                  }}
                >
                  {indexNames.map((name) => (
                    <button
                      key={name}
                      className={`list-group-item list-group-item-action ${
                        selectedIndex === name ? 'active bg-info' : ''
                      }`}
                      onClick={() => setSelectedIndex(name)}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-center text-danger">
                  No indexes found in CSV data!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content - Chart Display */}
        <div className="col-md-9">
          {loading ? (
            <div className="text-center mt-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading chart data...</p>
            </div>
          ) : selectedIndex ? (
            <div className="card shadow-sm">
              <div className="card-body">
                <ChartComponent 
                  selectedIndex={selectedIndex} 
                  data={data.filter(item => item.index_name === selectedIndex)} 
                />
              </div>
            </div>
          ) : (
            <div className="alert alert-info mt-3">
              {data.length === 0 ? "No data available" : "Please select an index"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;