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

  const handleKeyDown = (e, field) => {
    if(e.key === 'Enter' || e.key === 'Tab' ){
      e.preventDefault();
      const fields = ["freight", "quantity", "freight-calculate-btn"]
      const currentIndex = fields.indexOf(field)
      const nextField = document.getElementById(fields[currentIndex + 1])
      if(nextField){
        nextField.focus()
      }
    }
  }

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
          id="freight"
          value={freight}
          onChange={(e) => setFreight(parseFloat(e.target.value))}
          placeholder="Enter total freight"
          onKeyDown={(e) => handleKeyDown(e, "freight")}
        />
      </div>
      <div className="input-group">
        <label>Total Quantity:</label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(parseFloat(e.target.value))}
          placeholder="Enter total quantity"
          onKeyDown={(e) => handleKeyDown(e, "quantity")}
        />
      </div>
      <button onClick={calculateFreight} className="calculate-btn" id="freight-calculate-btn">Calculate</button>
      <div className="result">Freight per unit: {calculatedFreight}</div>
      <button onClick={handleCopy} className="copy-btn" >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}

export default FreightCalculation;
