import React, { useState } from "react";
import { CompanyDetails } from "./CompanyDetails";

const CompanyList = ({ companies }) => {
  const [selectedCompany, setSelectedCompany] = useState(""); // Store selected company

  // Sort company names alphabetically
  const companyNames = Object.keys(companies).sort();

  return (
    <div className="company-list">
      {/* 🔹 Company Dropdown */}
      <div className="dropdown-container">
        <label htmlFor="company-select">Select a Company:</label>
        <select
          id="company-select"
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
          className="company-dropdown"
        >
          <option value="">-- Choose a Company --</option>
          {companyNames.map((company, index) => (
            <option key={index} value={company}>
              {company}
            </option>
          ))}
        </select>
      </div>

      {/* 🔹 Show Company Details when selected */}
      {selectedCompany && <CompanyDetails company={selectedCompany} details={companies[selectedCompany]} />}
    </div>
  );
};

export default CompanyList;
