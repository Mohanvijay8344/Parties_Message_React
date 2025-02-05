import React, { useState } from "react";
import "./App.css";
import { CompanyDetails } from "./CompanyDetails";
import { processData } from "./processData";
import CompanyList from "./CompanyList";
import RateCalculation from "./RateCalculation";
import FreightCalculation from "./FreightCalculation";
import Chart from "./Chart";

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
        <div className="output-container">
          <CompanyList companies={processedData} />
          <RateCalculation />
          <FreightCalculation />

        </div>
        <Chart />
      </div>
    </div>
  );
}

export default App;
