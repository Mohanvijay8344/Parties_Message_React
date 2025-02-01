import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Set the worker source to a CDN
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

const PdfDataExtractor = () => {
  const [pdfText, setPdfText] = useState('');

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const pdfData = new Uint8Array(e.target.result);
        try {
          const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
          let text = '';

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map((item) => item.str).join(' ');
          }

          setPdfText(text);
        } catch (error) {
          console.error('Error parsing PDF:', error);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div>
      <h1>PDF Data Extractor</h1>
      <input type="file" accept="application/pdf" onChange={handleFileUpload} />
      <div>
        <h2>Extracted Text:</h2>
        <pre>{pdfText}</pre>
      </div>
    </div>
  );
};

export default PdfDataExtractor;