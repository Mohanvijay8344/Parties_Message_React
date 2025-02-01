import React, { useState } from "react";

function RateCalculation() {
  const [rate, setRate] = useState("");
  const [freight, setFreight] = useState("");
  const [option, setOption] = useState("All Inclusive");
  const [calculatedRate, setCalculatedRate] = useState(0);
  const [copied, setCopied] = useState(false);

  const calculateRate = () => {
    let result = 0;
    if (option === "All Inclusive") {
      result = (rate - freight) / 1.18;
    } else if (option === "Including Freight + GST Extra") {
      result = rate - freight;
    } else if (option === "Including GST & Freight Extra") {
      result = rate / 1.18;
    }
    setCalculatedRate(Math.round(result));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(calculatedRate);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div className="container">
      <h2>Rate Calculation</h2>
      <div className="input-group">
        <label>Rate:</label>
        <input
          type="number"
          value={rate}
          onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
          placeholder="Enter rate"
        />
      </div>
      <div className="input-group">
        <label>Freight:</label>
        <input
          type="number"
          value={freight}
          onChange={(e) => setFreight(parseFloat(e.target.value) || 0)}
          placeholder="Enter freight"
        />
      </div>
      <div className="input-group">
        <label>Calculation Type:</label>
        <select value={option} onChange={(e) => setOption(e.target.value)}>
          <option>All Inclusive</option>
          <option>Including Freight + GST Extra</option>
          <option>Including GST & Freight Extra</option>
        </select>
      </div>
      <button onClick={calculateRate} className="calculate-btn">Calculate</button>
      <div className="result">Basic Rate: {calculatedRate}</div>
      <button onClick={handleCopy} className="copy-btn">
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}

export default RateCalculation;
