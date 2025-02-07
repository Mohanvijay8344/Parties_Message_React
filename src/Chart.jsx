import React, { useState } from "react";
import "./Chart.css";

const Chart = () => {
  const hrData = [
    { thickness: 1.60, stripWidthCRFH: 544.0, stripWidthHR: 543.0, minWeight: 40.6, maxWeight: 41.0, minDiameter: 172.8, maxDiameter: 173.2 },
    { thickness: 1.80, stripWidthCRFH: 542.0, stripWidthHR: 543.5, minWeight: 45.0, maxWeight: 45.7, minDiameter: 172.8, maxDiameter: 173.2 },
    { thickness: 2.00, stripWidthCRFH: 542.0, stripWidthHR: 541.0, minWeight: 50.0, maxWeight: 50.7, minDiameter: 172.8, maxDiameter: 173.2 },
    { thickness: 2.20, stripWidthCRFH: 542.0, stripWidthHR: 540.5, minWeight: 55.0, maxWeight: 55.5, minDiameter: 172.8, maxDiameter: 173.2 },
    { thickness: 2.30, stripWidthCRFH: 542.0, stripWidthHR: 540.5, minWeight: 57.5, maxWeight: 58.0, minDiameter: 172.8, maxDiameter: 173.2 },
    { thickness: 2.50, stripWidthCRFH: 539.5, stripWidthHR: 539.0, minWeight: 62.5, maxWeight: 63.0, minDiameter: 172.8, maxDiameter: 173.2 },
  ];

  const giData = [
    { thickness: 1.60, stripWidthCRFH: 544.0, stripWidthHR: 543.0, minWeight: 41.8, maxWeight: 42.2, minDiameter: 172.8, maxDiameter: 173.2 },
    { thickness: 1.80, stripWidthCRFH: 542.0, stripWidthHR: 543.5, minWeight: 46.5, maxWeight: 47.0, minDiameter: 172.8, maxDiameter: 173.2 },
    { thickness: 2.00, stripWidthCRFH: 542.0, stripWidthHR: 541.0, minWeight: 51.5, maxWeight: 52.2, minDiameter: 172.8, maxDiameter: 173.2 },
    { thickness: 2.20, stripWidthCRFH: 542.0, stripWidthHR: 540.5, minWeight: 56.7, maxWeight: 57.2, minDiameter: 172.8, maxDiameter: 173.2 },
    { thickness: 2.30, stripWidthCRFH: 542.0, stripWidthHR: 540.5, minWeight: 59.3, maxWeight: 60.0, minDiameter: 172.8, maxDiameter: 173.2 },
    { thickness: 2.50, stripWidthCRFH: 539.5, stripWidthHR: 539.0, minWeight: 64.5, maxWeight: 64.9, minDiameter: 172.8, maxDiameter: 173.2 },
  ];


  const renderTable = (data, title) => (
    <div className="chart-table">
      <h2>{title}</h2>
      <table>
        <thead>
          <tr>
            <th>Max Diameter (mm)</th>
            <th>Thickness</th>
            <th>Min Weight (Kg/Pcs)</th>
            <th>Max Weight (Kg/Pcs)</th>
            <th>Weight</th>
            <th>Number of Pieces</th>
            <th>Result</th>
            <th>Difference</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => {
            const [weight, setWeight] = useState();
            const [pieces, setPieces] = useState();

            const result = weight && pieces ? weight / pieces : 0;
            const isInRange = result >= row.minWeight && result <= row.maxWeight;
            const showDifference = weight > 0 && pieces > 0 && !isInRange;

            return (
              <tr key={index}>
                <td>{row.maxDiameter}</td>
                <td>{row.thickness}</td>
                <td>{row.minWeight}</td>
                <td>{row.maxWeight}</td>
                <td>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                    className="table-input"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={pieces}
                    onChange={(e) => setPieces(parseInt(e.target.value, 10) || 0)}
                    className="table-input"
                  />
                </td>
                <td style={isInRange ? { color: "green" } : { color: "red" }}>
                  {result.toFixed(2)}
                </td>
                {showDifference && (
                  <td style={{ color: "red" }} className="difference-cell">
                    Actual Pipe Weight: {row.minWeight} - {row.maxWeight} Kgs
                    <br />
                    But now 1 Pipe Weight: {result.toFixed(2)} Kgs
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="chart-container">
      {renderTable(hrData, "HR Casing Weight Chart (Varnished Pipe)")}
      {renderTable(giData, "GI Casing Weight Chart")}
    </div>
  );
};

export default Chart;
