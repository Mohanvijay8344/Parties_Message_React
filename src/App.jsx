import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import { processData } from "./processData";
import Calculator from "./Calculator";
import PieceCalculator from "./PieceCalculator";
import Chart from "./Chart";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import ContactList from "./ContactList";

function MainContent() {
  const [inputData, setInputData] = useState("");
  const processedData = processData(inputData);

  const handleInputChange = (e) => {
    setInputData(e.target.value);
  };

  const InputTextArea = () => {
    return (
      <div className="input-container">
        <textarea
          value={inputData}
          onChange={handleInputChange}
          placeholder="Enter your data here..."
        />
      </div>
    );
  };

  return (
    <>
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home inputData={processedData} InputTextArea={InputTextArea} />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/piece-calculator" element={<PieceCalculator />} />
          <Route path="/charts" element={<Chart />} />
          <Route path="/contacts" element={<ContactList />} />
        </Routes>
        
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <MainContent />
      </div>
    </Router>
  );
}

export default App;
