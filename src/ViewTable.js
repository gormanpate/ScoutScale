import React, { useState } from 'react';
import Papa from 'papaparse';
import './Table.css'; 

const ViewTable = ({ authCode }) => {
  const [csvData, setCsvData] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          setCsvData(result.data);
        },
        header: true,
      });
    }
  };

  const downloadInstructions = () => {
    const fileId = '1bUzE1JjuVKVkfNXf6pCxx5Op2LNwQfnd';
    const instructionsFile = `https://drive.google.com/uc?export=download&id=${fileId}`;
    window.location.href = instructionsFile;
  };

  const sortBy = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    if (!csvData) return [];
    if (!sortConfig.key) return csvData;
    
    const sorted = [...csvData].sort((a, b) => {
      var isEmpty = false;
      var aValue = a[sortConfig.key];
      var bValue = b[sortConfig.key];
      if (!isNaN(a[sortConfig.key]) && !isNaN(b[sortConfig.key]))
      {
        aValue = parseFloat(a[sortConfig.key]);
        bValue = parseFloat(b[sortConfig.key]);
        isEmpty = !aValue || !bValue;
      }
      else
      {
        isEmpty = !aValue || !bValue || aValue.trim() === '' || bValue.trim() === '';
      }
      if (isEmpty) {
        return 0;
      }
  
      if (aValue == null || bValue == null) {
        return 0;
      }
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return sorted;
  };
  
  return (
    <div>
        <br></br>
        <div className="text-center text-3xl font-bold mt-20">Export and view your data.</div>
        <p className="text-center mt-5">
            Download <span onClick={downloadInstructions} className="download-link">this</span> zip file and follow instructions to view your data. Begin by extracting the zip after download and then reading the Instructions.txt 
        </p>
        <p className="text-center">
            These instructions only work on Windows machines.
        </p>
        <div className="table-container">
            <div className="input-file-container text-center">
            <label htmlFor="file" className="input-file-label">Upload CSV File</label>
            <input type="file" id="file" accept=".csv" className="input-file" onChange={handleFileUpload} />
            </div>
            {csvData && (
            <div className="table-container mt-5">
                <table className="table">
                <thead>
                    <tr>
                    {Object.keys(csvData[0]).map((header) => (
                        <th key={header} onClick={() => sortBy(header)}>
                          {header}
                          {sortConfig.key === header && (
                            sortConfig.direction === 'asc' ? ' ↓' : ' ↑'
                          )}
                        </th>
                    ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedData().map((row, index) => (
                    <tr key={index}>
                        {Object.values(row).map((value, idx) => (
                        <td key={idx}>{value}</td>
                        ))}
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            )}
        </div>
    </div>
  );
};

export default ViewTable;