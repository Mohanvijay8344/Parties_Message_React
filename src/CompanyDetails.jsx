import React, { useEffect, useState, useRef } from "react";

export const CompanyDetails = ({ company, details = {} }) => {
  const [copied, setCopied] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState("");
  const [quantities, setQuantities] = useState({}); // State to store quantities
  const [freight, setFreight] = useState("");
  const [nosValues, setNosValues] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(null); // State to manage dropdown visibility
  const [editMode, setEditMode] = useState(null); // State to manage edit mode
  const [pipeDetails, setPipeDetails] = useState(details); // State to manage the list of pipes
  const [tempEditValue, setTempEditValue] = useState(""); // Temporary state for edit mode
  const [truckNumber, setTruckNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

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

  // Refs to track input fields
  const inputRefs = useRef([]);

  useEffect(() => {
    setQuantities({});
    setNosValues({});
    setFreight("");
    setSelectedTransport("");
    setTruckNumber("");
    setMobileNumber("");
    setCopied(false);
  }, [company]);

  useEffect(() => {
    // Update pipeDetails when the details prop changes
    setPipeDetails(details || {});
  }, [details]);

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
    Object.entries(pipeDetails).forEach(([pipeType, pipes]) => {
      pipes.forEach((pipe) => {
        const key = `${pipeType}-${pipe.spec}`;
        const quantity = parseFloat(quantities[key]) || 0;
        total += quantity; // Add the quantity directly
      });
    });
    return total.toFixed(3); // Apply toFixed only to the final total
  };

  const formatTruckNumber = (number) => {
    if (!number) return "";
    
    // Remove all spaces and convert to uppercase
    const cleanNumber = number.replace(/\s/g, '').toUpperCase();
    
    // Special cases
    if (cleanNumber === "TN56A6031") return "TN 56 A 6031";
    if (cleanNumber === "TN41AK8376") return "TN 41 AK 8376";
    
    // Handle manual typing by accepting partial inputs
    let formatted = '';
    let i = 0;
    
    // State code (2 letters)
    if (i < cleanNumber.length) {
      formatted += cleanNumber.slice(i, Math.min(i + 2, cleanNumber.length));
      i += 2;
      if (i < cleanNumber.length && i >= 2) formatted += ' ';
    }
    
    // District number (2 digits)
    if (i < cleanNumber.length) {
      formatted += cleanNumber.slice(i, Math.min(i + 2, cleanNumber.length));
      i += 2;
      if (i < cleanNumber.length && i >= 4) formatted += ' ';
    }
    
    // Series letters (1-2 letters)
    const remainingChars = cleanNumber.slice(i);
    const letterMatch = remainingChars.match(/^[A-Z]{1,2}/);
    if (letterMatch) {
      formatted += letterMatch[0];
      i += letterMatch[0].length;
      if (i < cleanNumber.length) formatted += ' ';
    }
    
    // Vehicle number (4 digits)
    if (i < cleanNumber.length) {
      formatted += cleanNumber.slice(i);
    }
    
    return formatted;
  };

  const handleVehicleInput = (value) => {
    // Split input by newline
    const lines = value.split('\n');
    
    // Handle first line (truck number)
    const truckLine = lines[0] || '';
    // Allow only letters and numbers for truck number
    const cleanTruck = truckLine.replace(/[^A-Za-z0-9]/g, '');
    setTruckNumber(cleanTruck);
    
    // Handle second line (mobile number)
    const mobileLine = lines[1] || '';
    // Handle both with and without CT- prefix
    const cleanMobile = mobileLine.replace(/^CT[-.]?\s*/, '').replace(/\D/g, '').slice(0, 10);
    setMobileNumber(cleanMobile);
  };

  const getFormattedInputValue = () => {
    let value = "";
    if (truckNumber) value += formatTruckNumber(truckNumber);
    if (mobileNumber) value += mobileNumber ? `\nCT- ${mobileNumber}` : "";
    return value;
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

  const handleNosChange = (pipeType, spec, value) => {
    setNosValues((prevNos) => ({
      ...prevNos,
      [`${pipeType}-${spec}`]: value,
    }));
  };

  const freightAmount = (e) => {
    const amount = parseFloat(e.target.value);
    setFreight(amount);
  };

  const handleKeyDown = (e, currentIndex) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      const nextIndex = currentIndex + 1;
      if (nextIndex < inputRefs.current.length) {
        inputRefs.current[nextIndex].focus();
      }
    }
  };

  const handleDropdownToggle = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handleEdit = (pipeType, spec, currentSpec) => {
    setEditMode(`${pipeType}-${spec}`);
    setTempEditValue(currentSpec); // Initialize tempEditValue with the current spec
    setDropdownOpen(null);
  };

  const handleCompleteEdit = (pipeType, index) => {
    const updatedDetails = { ...pipeDetails };
    updatedDetails[pipeType][index].spec = tempEditValue; // Update the spec with the temp value
    setPipeDetails(updatedDetails);
    setEditMode(null); // Exit edit mode
  };

  const handleDelete = (pipeType, spec) => {
    const updatedDetails = { ...pipeDetails };
    updatedDetails[pipeType] = updatedDetails[pipeType].filter((pipe) => pipe.spec !== spec);
    setPipeDetails(updatedDetails);
    setDropdownOpen(null);
  };

  const handleAddPipe = (pipeType) => {
    const updatedDetails = { ...pipeDetails };
    updatedDetails[pipeType] = [...(updatedDetails[pipeType] || []), { spec: "", quantity: "" }];
    setPipeDetails(updatedDetails);
  };

  // Flatten all input fields into a single array
  const flattenedInputs = [];
  Object.keys(pipeDetails).forEach((pipeType) => {
    if (pipeDetails[pipeType] && pipeDetails[pipeType].length > 0) {
      pipeDetails[pipeType].forEach((pipe, index) => {
        flattenedInputs.push({ pipeType, pipe, index });
      });
    }
  });

  const getFormattedText = () => {
    let text = `${company}\n`;
    if (truckNumber) text += `${formatTruckNumber(truckNumber)}\n`;
    if (mobileNumber) text += `CT- ${mobileNumber}\n\n`;

    Object.keys(pipeDetails).forEach((pipeType) => {
      if (pipeDetails[pipeType] && pipeDetails[pipeType].length > 0) {
        text += `${pipeType}\n`;
        pipeDetails[pipeType].forEach((pipe) => {
          const key = `${pipeType}-${pipe.spec}`;
          const quantity = quantities[key] || "";
          const nosText = pipe.spec.includes("173") && nosValues[key] ? ` (${nosValues[key]} Nos)` : "";

          text += `${pipe.spec} - ${quantity}${nosText}\n`;
        });
        text += `\n`;
      }
    });

    text += `Total      - ${calculateTotal()} M.T.\n\n`;
    text += `Freight-Rs.${freight}/- Per M.T.\n\n`;
    text += `${selectedTransport || " "}\n\n`;

    return text;
  };

  return (
    <div className="company-card">
      <div className="company-header">
        <h2 className="company-title">{company}</h2>
        <div className="summary-row" style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
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
          <textarea
            placeholder="Truck Number and Mobile Number"
            value={getFormattedInputValue()}
            onChange={(e) => handleVehicleInput(e.target.value)}
            style={{ 
              width: '250px', 
              height: '60px', 
              resize: 'none',
              fontFamily: 'monospace',
              padding: '8px'
            }}
            rows={2}
          />
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
        {Object.keys(pipeDetails).map((pipeType) => {
          if (pipeDetails[pipeType] && pipeDetails[pipeType].length > 0) {
            return (
              <div key={pipeType} className="pipe-section">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', justifyContent: 'space-between' }}>
                  <h3 className="pipe-title">{pipeType}</h3>
                  <button className="complete-button" onClick={() => handleAddPipe(pipeType)}>Add Pipe</button>
                </div>
                <div className="pipes">
                  {pipeDetails[pipeType].map((pipe, index) => {
                    const key = `${pipeType}-${pipe.spec}`;
                    const enteredQuantity = parseFloat(quantities[key]) || 0;
                    const actualQuantity = parseFloat(pipe.quantity) || 0;

                    const isValid = validateQuantity(enteredQuantity, actualQuantity);

                    const flattenedIndex = flattenedInputs.findIndex(
                      (input) => input.pipeType === pipeType && input.pipe.spec === pipe.spec
                    );

                    return (
                      <div key={index} className="pipe-item">
                        <span className="pipe-spec" onDoubleClick={() => handleEdit(pipeType, pipe.spec, pipe.spec)}>
                          {editMode === key ? (
                            <input
                              type="text"
                              value={tempEditValue}
                              onChange={(e) => setTempEditValue(e.target.value)}
                              className="edit-input"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleCompleteEdit(pipeType, index);
                                } else {
                                  handleKeyDown(e, flattenedIndex);
                                }
                              }}
                              autoFocus
                            />
                          ) : (
                            <span style={{ cursor: 'pointer' }}>{pipe.spec || "New Pipe"}</span>
                          )}{" "}
                          -{" "}
                        </span>
                        <input
                          type="number"
                          value={quantities[key] || ""}
                          onChange={(e) =>
                            handleQuantityChange(pipeType, pipe.spec, e.target.value)
                          }
                          placeholder="Qty"
                          className="quantity-input"
                          ref={(el) => (inputRefs.current[flattenedIndex] = el)}
                          onKeyDown={(e) => handleKeyDown(e, flattenedIndex)}
                        />
                        {pipe.spec.includes("173") && (
                          <span>
                            <input
                              type="number"
                              placeholder="Nos"
                              className="quantity-input"
                              value={nosValues[key] || ""}
                              onChange={(e) => handleNosChange(pipeType, pipe.spec, e.target.value)}
                              ref={(el) => (inputRefs.current[flattenedIndex + 1] = el)}
                              onKeyDown={(e) => handleKeyDown(e, flattenedIndex + 1)}
                            />
                          </span>
                        )}
                        <div className="dropdown">
                          <button className="dropdown-toggle" onClick={() => handleDropdownToggle(flattenedIndex)}>
                            ⋮
                          </button>
                          {dropdownOpen === flattenedIndex && (
                            <div className="dropdown-menu">
                              <button onClick={() => handleEdit(pipeType, pipe.spec, pipe.spec)}>Edit</button>
                              <button onClick={() => handleDelete(pipeType, pipe.spec)}>Delete</button>
                            </div>
                          )}
                        </div>
                        {quantities[key] && (
                          <span className="quantity-validation">
                            {isValid ? (
                              <span className="valid-quantity">✅✅ Qty: {quantities[key]} M.T.</span>
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
              value={freight}
            />
            /- Per M.T.
          </span>
        </div>
      </div>
    </div>
  );
};