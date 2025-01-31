import React, { useState } from "react";

export const CompanyDetails = ({ company, details }) => {
  const [copied, setCopied] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState("");
  const [quantities, setQuantities] = useState({}); // State to store quantities
  const [freight, setFreight] = useState("");

  const transportOptions = [
    "K.S.Shanmugasundaram Transports",
    "KSK Logistics Pvt Ltd",
    "Murugan Transports",
    "Sree Maruthi Transports",
    "Sree Mayilvahanam Lorry Transports",
    "Sri Raja Lorry Transports",
    "Sri Venkatramana Transports",
    "Party Truck",
  ];

  const handleQuantityChange = (pipeType, spec, value) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [`${pipeType}-${spec}`]: value,
    }));
  };

  const validateQuantity = (enteredQty, actualQty) => {
    if (!actualQty || isNaN(actualQty)) return false; // Ensure actualQty is valid
    const difference = Math.abs(enteredQty - actualQty); // Calculate the absolute difference
    return difference <= 1; // Return true if within ±1
  };

  const calculateTotal = () => {
    let total = 0;
    Object.entries(details).forEach(([pipeType, pipes]) => {
      pipes.forEach((pipe) => {
        const key = `${pipeType}-${pipe.spec}`;
        const quantity = parseFloat(quantities[key]) || 0;
        total += quantity; // Add the quantity directly
      });
    });
    return total.toFixed(3); // Apply toFixed only to the final total
  };

  const getFormattedText = () => {
    let text = `${company}\n\n\n`;

    Object.keys(details).forEach((pipeType) => {
      if (details[pipeType] && details[pipeType].length > 0) {
        text += `${pipeType}\n`;
        details[pipeType].forEach((pipe) => {
          const key = `${pipeType}-${pipe.spec}`;
          const quantity = quantities[key] || "";
          text += `${pipe.spec} - ${quantity}\n`;
        });
        text += `\n`;
      }
    });

    text += `Total      - ${calculateTotal()} M.T.\n\n`;
    text += `Freight-Rs.${freight}/- Per M.T.\n\n`;
    text += `${selectedTransport || " "}`;

    return text;
  };

  const handleCopy = async () => {
    try {
      const text = getFormattedText();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const freightAmount = (e) => {
    const amount = parseFloat(e.target.value);
    setFreight(amount);
  };

  return (
    <div className="company-card">
      <div className="company-header">
        <h2 className="company-title">{company}</h2>
        <div className="summary-row">
          <select
            id="transport"
            value={selectedTransport}
            onChange={(e) => setSelectedTransport(e.target.value)}
          >
            <option value="">Select Transport</option>
            {transportOptions.map((transport, index) => (
              <option key={index} value={transport}>
                {transport}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleCopy}
          className={`copy-button ${copied ? "copied" : ""}`}
          title="Copy to clipboard"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <div className="pipe-sections">
        {Object.keys(details).map((pipeType) => {
          if (details[pipeType] && details[pipeType].length > 0) {
            return (
              <div key={pipeType} className="pipe-section">
                <h3 className="pipe-title">{pipeType}</h3>
                <div className="pipes">
                  {details[pipeType].map((pipe, index) => {
                    const key = `${pipeType}-${pipe.spec}`;
                    const enteredQuantity = parseFloat(quantities[key]) || 0;
                    const actualQuantity = parseFloat(pipe.quantity) || 0;
                    console.log(enteredQuantity, actualQuantity);

                    const isValid = validateQuantity(
                      enteredQuantity,
                      actualQuantity
                    );
                    return (
                      <div key={index} className="pipe-item">
                        <span className="pipe-spec">{pipe.spec} - </span>
                        <input
                          type="number"
                          value={quantities[key] || ""}
                          onChange={(e) =>
                            handleQuantityChange(
                              pipeType,
                              pipe.spec,
                              e.target.value
                            )
                          }
                          placeholder="Qty"
                          className="quantity-input"
                        />
                        {quantities[key] && (
                          <span className="quantity-validation">
                            {isValid ? (
                              <span className="valid-quantity">✅✅</span>
                            ) : (
                              <span className="invalid-quantity">
                                ❌❌ Actual: {actualQuantity} M.T
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="summary-box">
        <div className="summary-row">
          <span>Total - {calculateTotal()} M.T.</span>
        </div>
        <div className="summary-row">
          <span>
            Freight-Rs.
            <input
              type="number"
              placeholder=""
              className="quantity-input"
              onChange={freightAmount}
            />
            /- Per M.T.
          </span>
        </div>
      </div>
    </div>
  );
};
