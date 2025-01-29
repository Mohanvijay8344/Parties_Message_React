import React, { useState } from 'react';
import './App.css';

const processData = (inputData) => {
  const lines = inputData.split('\n').map(line => line.trim()).filter(line => line);
  const companies = {};
  let currentCompany = '';

  const cleanSpec = (spec) => {
    // Remove all suffixes and clean the spec
    let cleaned = spec
      .replace(/ - P\/E/g, '')
      .replace(/ - With Seal/g, '')
      .replace(/ - Without Seal/g, '')
      .replace(/ - With Out Seal/g, '')
      .replace(/ - SWS/g, '')
      .replace(/ - Varnished/g, '')
      .replace(/MM/g, '')
      .replace(/ Nos$/, '')
      .trim();

    // Extract only the size part (remove any trailing numbers)
    const match = cleaned.match(/^[\d.x]+/);
    return match ? match[0] : cleaned;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for company names (contains " - " but not "Pipes")
    if (line.includes(' - ') && !line.includes('Pipes')) {
      currentCompany = line;
      if (!companies[currentCompany]) {
        companies[currentCompany] = {
          'GI Pipes': [],
          'GP Pipes': [],
          'HR Pipes': [],
          'Crfh Pipes': [],
          total: ''
        };
      }
      continue;
    }

    if (line.includes('Pipes') || line.includes('Coil')) {
      const pipeType = line.toLowerCase().includes('gi pipes') ? 'GI Pipes' : 
                      line.toLowerCase().includes('gp pipes') ? 'GP Pipes' :
                      line.toLowerCase().includes('hr pipes') ? 'HR Pipes' : 
                      line.toLowerCase().includes('crfh pipes') ? 'Crfh Pipes' : null;
      
      if (pipeType && currentCompany) {
        const spec = line
          .replace(/^GI Pipes /i, '')
          .replace(/^GP Pipes /i, '')
          .replace(/^HR Pipes /i, '')
          .replace(/^Crfh Pipes /i, '')
          .replace(/^CRFH Pipes /i, '');

        companies[currentCompany][pipeType].push({
          spec: cleanSpec(spec),
          quantity: ''
        });
      }
    }
  }

  return companies;
};

const CompanyDetails = ({ company, details }) => {
  const [copied, setCopied] = useState(false);
  
  const getFormattedText = () => {
    let text = `${company}\n\n`;
    
    ['GI Pipes', 'GP Pipes', 'HR Pipes', 'Crfh Pipes'].forEach(pipeType => {
      if (details[pipeType] && details[pipeType].length > 0) {
        const title = pipeType;
        text += `${title}\n`;
        details[pipeType].forEach(pipe => {
          text += `${pipe.spec} - \n`;
        });
        text += `\nTotal      - \n\n`;
        text += `Freight-Rs./- Per M.T.\n\n`;
      }
    });
    
    return text;
  };

  const handleCopy = async () => {
    try {
      const text = getFormattedText();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="company-card">
      <div className="company-header">
        <h2 className="company-title">
          {company}
        </h2>
        <button
          onClick={handleCopy}
          className={`copy-button ${copied ? 'copied' : ''}`}
          title="Copy to clipboard"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      
      <div className="pipe-sections">
        {['GI Pipes', 'GP Pipes', 'HR Pipes', 'Crfh Pipes'].map(pipeType => {
          if (details[pipeType] && details[pipeType].length > 0) {
            return (
              <div key={pipeType} className="pipe-section">
                <h3 className="pipe-title">
                  {pipeType} 
                </h3>
                <div className="pipes">
                  {details[pipeType].map((pipe, index) => (
                    <div key={index} className="pipe-item">
                      <span className="pipe-spec">{pipe.spec} - </span>
                    </div>
                  ))}
                </div>
                <div className="summary-box">
                  <div className="summary-row">
                    <span>Total      - </span>
                  </div>
                  <span className='summary-value'></span>
                  <div className="summary-row">
                    <span>Freight-Rs./- Per M.T.</span>
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

function App() {
  const [inputData, setInputData] = useState('');
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