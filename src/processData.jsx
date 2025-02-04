export const processData = (inputData) => {
  const lines = inputData
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line);
  const companies = {};
  let currentCompany = "";

  // Mapping for normalizing pipe types
  const pipeTypeMapping = {
    "gi pipes": "GI Pipes",
    "gp pipes": "GP Pipes",
    "hr pipes": "HR Pipes",
    "crfh pipes": "CRFH Pipes", // Normalize to "CRFH Pipes"
    "gp slit coil": "GP Slit Coil",
    "hr slit coil": "HR Slit Coil",
    "gi slit coil": "GI Slit Coil",
  };

  const cleanSpec = (spec, pipeType) => {
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

      if (pipeType.toLowerCase().includes("coil")) {
        return cleaned; // Return the full specification for coils
      }
      
      // Extract only the size part (remove any trailing numbers)
      const match = cleaned.match(/^[\d.x]+/);
      return match ? match[0] : cleaned;
    };
    
    

    for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Keep this line unchanged
    if (line.includes(" - ") && !line.toLowerCase().includes("gp pipes") && !line.toLowerCase().includes("hr pipes") && !line.toLowerCase().includes("gi pipes") && !line.toLowerCase().includes("crfh pipes") && !line.toLowerCase().includes("coli")) {
      currentCompany = line.replace(/[0-9.]+$/, "").trim();

      if (!companies[currentCompany]) {
        companies[currentCompany] = {
          "GI Pipes": [],
          "GP Pipes": [],
          "HR Pipes": [],
          "CRFH Pipes": [], // Use normalized key
          "GP Slit Coil": [],
          "HR Slit Coil": [],
          "GI Slit Coil": [],
        };
      }
      continue;
    }

    if (line.toLowerCase().includes("pipes") || line.toLowerCase().includes("coil")) {
      const lowerCaseLine = line.toLowerCase();
      const pipeType = pipeTypeMapping[
        Object.keys(pipeTypeMapping).find((key) => lowerCaseLine.includes(key.toLowerCase()))
      ];
      

      if (pipeType && currentCompany) {
        // Preserve the original line for display
        const originalLine = line;

        // Extract the specification and quantity
        const specAndQuantity = originalLine
          .replace(/^GI Pipes /i, "")
          .replace(/^GP Pipes /i, "")
          .replace(/^HR Pipes /i, "")
          .replace(/^Crfh Pipes /i, "")
          .replace(/^GP Slit Coil /i, "")
          .replace(/^HR Slit Coil /i, "")
          .replace(/^GI Slit Coil /i, "")
          .trim();

        // Case 1: Quantity is on the same line (e.g., "88.90x2.50MM - SWS 12" or "88.90x2.50MM - SWS 0.6")
        const quantityMatchSameLine = specAndQuantity.match(/(\d+(\.\d+)?)\s*$/);

let quantity = quantityMatchSameLine ? parseFloat(quantityMatchSameLine[0]) : 0; // Use parseFloat to handle decimals

// Case 2: Quantity is on the next line (e.g., "88.90x2.50MM - SWS" followed by "0.6")
if (!quantityMatchSameLine && i + 1 < lines.length && !isNaN(parseFloat(lines[i + 1]))) {
  quantity = parseFloat(lines[i + 1]); // Use parseFloat to handle decimals
  i++; // Skip the next line (quantity)
}

        // Remove the quantity from the spec
        const spec = specAndQuantity.replace(/(\d+)$/, "").trim();
        
        
        companies[currentCompany][pipeType].push({
          spec: cleanSpec(spec, pipeType), // Clean the spec for processing
          originalSpec: spec, // Preserve the original spec for display
          originalPipeType: originalLine.split(" ")[0] + " " + originalLine.split(" ")[1], // Preserve original pipe type
          quantity: quantity, // Add extracted quantity
        });
      }
    }
  }

  return companies;
};