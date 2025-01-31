import React, { useState } from "react";

export const CompanyDetails = ({ company, details }) => {
  const [copied, setCopied] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState("");

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

  const getFormattedText = () => {
    let text = `${company}\n\n\n`;

    [
      "GI Pipes",
      "GP Pipes",
      "HR Pipes",
      "Crfh Pipes",
      "GP Slit Coil",
      "HR Slit Coil",
      "GI Slit Coil",
    ].forEach((pipeType) => {
      if (details[pipeType] && details[pipeType].length > 0) {
        text += `${pipeType}\n`;
        details[pipeType].forEach((pipe) => {
          text += `${pipe.spec} - \n`;
        });
        text += `\n`;
      }
    });

    text += `Total      - \n\n`;
    text += `Freight-Rs./- Per M.T.\n\n`;
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
        {[
          "GI Pipes",
          "GP Pipes",
          "HR Pipes",
          "Crfh Pipes",
          "CRFH Pipes",
          "GP Slit Coil",
          "HR Slit Coil",
          "GI Slit Coil",
        ].map((pipeType) => {
          if (details[pipeType] && details[pipeType].length > 0) {
            return (
              <div key={pipeType} className="pipe-section">
                <h3 className="pipe-title">{pipeType}</h3>
                <div className="pipes">
                  {details[pipeType].map((pipe, index) => (
                    <div key={index} className="pipe-item">
                      <span className="pipe-spec">{pipe.spec} - </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="summary-box">
        <div className="summary-row">
          <span>Total - </span>
        </div>
        <div className="summary-row">
          <span>Freight-Rs./- Per M.T.</span>
        </div>

        
      </div>
    </div>
  );
};
