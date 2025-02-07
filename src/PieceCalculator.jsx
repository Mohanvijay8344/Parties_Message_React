import React, { useState, useRef } from "react";
import "./PieceCalculator.css"; // Importing external CSS

const PieceCalculator = () => {
  const [totalPieces, setTotalPieces] = useState();
  const [totalQuantity, setTotalQuantity] = useState();
  const [findQuantity, setFindQuantity] = useState();

  const totalPiecesRef = useRef(null);
  const totalQuantityRef = useRef(null);
  const findQuantityRef = useRef(null);

  const handleTotalPiecesChange = (e) => {
    setTotalPieces(parseInt(e.target.value, 10));
  };

  const handleTotalQuantityChange = (e) => {
    setTotalQuantity(parseInt(e.target.value, 10));
  };

  const handleFindQuantityChange = (e) => {
    setFindQuantity(parseInt(e.target.value, 10));
  };

  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter" && nextRef.current) {
      nextRef.current.focus();
    }
  };

  const calculateBalanceQuantity = () => {
    if (totalPieces === 0 || totalQuantity === 0) return 0;
    return totalQuantity - findQuantity;
  };

  const calculateBalancePieces = () => {
    if (totalPieces === 0 || totalQuantity === 0) return 0;
    return (calculateBalanceQuantity() * totalPieces) / totalQuantity;
  };

  const calculateQuantity = () => {
    if (totalPieces === 0 || totalQuantity === 0) return 0;
    return (findQuantity * totalPieces) / totalQuantity;
  };

  return (
    <div className="piece-calculator">
      <h1 className="title">Pieces Calculation</h1>
      <div className="input-container">
        <table className="results-table">
          <thead>
            <tr>
              <th>Total Pieces</th>
              <th>Total Quantity</th>
              <th>Find Quantity</th>
              <th>Balance Pieces</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  type="number"
                  value={totalPieces}
                  onChange={handleTotalPiecesChange}
                  onKeyDown={(e) => handleKeyDown(e, totalQuantityRef)}
                  ref={totalPiecesRef}
                  className="table-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={totalQuantity}
                  onChange={handleTotalQuantityChange}
                  onKeyDown={(e) => handleKeyDown(e, findQuantityRef)}
                  ref={totalQuantityRef}
                  className="table-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={findQuantity}
                  onChange={handleFindQuantityChange}
                  className="table-input"
                  ref={findQuantityRef}
                />
              </td>
              <td>{Math.round(calculateQuantity())}</td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td className="total-balance">{calculateBalanceQuantity()}</td>
              <td>{Math.round(calculateBalancePieces())}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PieceCalculator;
