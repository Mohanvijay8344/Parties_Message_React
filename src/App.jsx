import React, { useState } from "react";
import "./App.css";

const processData = (inputData) => {
  const lines = inputData
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line);
  const companies = {};
  let currentCompany = "";

  const cleanSpec = (spec) => {
    // Remove all suffixes and clean the spec
    let cleaned = spec
      .replace(/ - P\/E/g, "")
      .replace(/ - With Seal/g, "")
      .replace(/ - Without Seal/g, "")
      .replace(/ - With Out Seal/g, "")
      .replace(/ - SWS/g, "")
      .replace(/ - Varnished/g, "")
      .replace(/MM/g, "")
      .replace(/ Nos$/, "")
      .trim();

    // Extract only the size part (remove any trailing numbers)
    const match = cleaned.match(/^[\d.x]+/);
    return match ? match[0] : cleaned;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for company names (contains " - " but not "Pipes")
    if (line.includes(" - ") && !line.includes("Pipes")) {
      currentCompany = line.replace(/[0-9.]/g, "");
      if (!companies[currentCompany]) {
        companies[currentCompany] = {
          "GI Pipes": [],
          "GP Pipes": [],
          "HR Pipes": [],
          "CRFH Pipes": [],
          "Crfh Pipes": [],
          "GP Slit Coil": [],
          "HR Slit Coil": [],
          "GI Slit Coil": [],
        };
      }
      continue;
    }

    if (line.includes("Pipes") || line.includes("Coil")) {
      const pipeType = line.toLowerCase().includes("gi pipes")
        ? "GI Pipes"
        : line.toLowerCase().includes("gp pipes")
        ? "GP Pipes"
        : line.toLowerCase().includes("hr pipes")
        ? "HR Pipes"
        : line.toLowerCase().includes("crfh pipes")
        ? "Crfh Pipes"
        : line.toLowerCase().includes("gp slit coil")
        ? "GP Slit Coil"
        : line.toLowerCase().includes("hr slit coil")
        ? "HR Slit Coil"
        : line.toLowerCase().includes("gi slit coil")
        ? "GI Slit Coil"
        : line.toLowerCase().includes("crfh pipes")
        ? "CRFH Pipes"
        : null;

      if (pipeType && currentCompany) {
        const spec = line
          .replace(/^GI Pipes /i, "")
          .replace(/^GP Pipes /i, "")
          .replace(/^HR Pipes /i, "")
          .replace(/^Crfh Pipes /i, "")
          .replace(/^GP Slit Coil /i, "")
          .replace(/^HR Slit Coil /i, "")
          .replace(/^GI Slit Coil /i, "")
          .replace(/^CRFH Pipes /i, "");

        companies[currentCompany][pipeType].push({
          spec: cleanSpec(spec),
          quantity: "",
        });
      }
    }
  }

  return companies;
};

const CompanyDetails = ({ company, details }) => {
  const [copied, setCopied] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState("");

  const transportOptions = [
    "K.S.Shanmugasundaram Transports",
    "Sree Maruthi Transports",
    "Murugan Transports",
    "KSK Logistics Pvt Ltd",
    "Sree Mayilvahanam Lorry Transports",
    "Sri Raja Lorry Transports",
    "Sri Venkatramana Transports",
    "Party Truck",
  ];

  const getFormattedText = () => {
    let text = `${company}\n\n`;

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
    text += `${selectedTransport || " "}\n\n`;

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
      </div>
    </div>
  );
};

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
        <div className="companies-grid">
          {Object.entries(processedData).map(([company, details]) => (
            <div key={company} className="company-card-wrapper">
              <CompanyDetails company={company} details={details} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
