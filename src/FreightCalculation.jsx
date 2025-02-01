import React, { useState } from "react";

function FreightCalculation() {
  const [freight, setFreight] = useState();
  const [quantity, setQuantity] = useState();
  const [calculatedFreight, setCalculatedFreight] = useState(0);
  const [copied, setCopied] = useState(false);

  const calculateFreight = () => {
    if (quantity > 0) {
      const freightPerUnit = freight / quantity;
      setCalculatedFreight(Math.round(freightPerUnit/10)*10);
    } else {
      setCalculatedFreight(0);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(calculatedFreight);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div className="container">
      <h2>Freight Calculation</h2>
      <div className="input-group">
        <label>Total Freight:</label>
        <input
          type="number"
          value={freight}
          onChange={(e) => setFreight(parseFloat(e.target.value) || 0)}
          placeholder="Enter total freight"
        />
      </div>
      <div className="input-group">
        <label>Total Quantity:</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
          placeholder="Enter total quantity"
        />
      </div>
      <button onClick={calculateFreight} className="calculate-btn">Calculate</button>
      <div className="result">Freight per unit: {calculatedFreight}</div>
      <button onClick={handleCopy} className="copy-btn">
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}

export default FreightCalculation;
