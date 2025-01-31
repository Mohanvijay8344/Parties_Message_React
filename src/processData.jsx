export const processData = (inputData) => {
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

  console.log(companies);
  return companies;
  
};
