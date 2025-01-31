import React, { useState } from "react";
import "./App.css";
import { CompanyDetails } from "./CompanyDetails";
import { processData } from "./processData";
import CompanyList from "./CompanyList";

function App() {
  const [inputData, setInputData] = useState("");
  const processedData = processData(inputData);

  const handleInputChange = (e) => {
    setInputData(e.target.value);
  };

  return (
    <div className="app-container">
      <div className="app-content">
        <div className="input-container">
          <textarea
            value={inputData}
            onChange={handleInputChange}
            className="data-textarea"
            placeholder="Enter your pipe data here..."
          />
        </div>
        <CompanyList companies={processedData} />
        
      </div>
    </div>
  );
}

export default App;
