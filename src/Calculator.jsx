import React, { useState, useEffect, useRef } from "react";
import "./Calculator.css";

const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [showNumbers, setShowNumbers] = useState(false);
  const [isFocused, setIsFocused] = useState(false); // Track focus state
  const calculatorRef = useRef(null);

  // Handle button clicks
  const handleButtonClick = (value) => {
    if (!isFocused) return;

    if (display === "0" && value !== ".") {
      setDisplay(value);
    } else {
      setDisplay((prev) => prev + value);
    }
  };

  // Handle clear
  const handleClear = () => {
    if (!isFocused) return; // Ignore input if calculator is not focused
    setDisplay("0");
  };

  // Handle equals
  const handleEquals = () => {
    if (!isFocused) return;
    try {
      const result = eval(display);
      setDisplay(result.toString());
    } catch (error) {
      setDisplay("Error");
    }
  };

  const handleBackspaceClick = () => {
    if (!isFocused) return;
    setDisplay(display.slice(0, -1));
    if (display.length === 1) {
      setDisplay("0");
    }
  }

  // Handle advanced operations
  const handleAdvancedOperation = (operation) => {
    try {
      let result;
      switch (operation) {
        case "sqrt":
          result = Math.sqrt(parseFloat(display));
          break;
        case "percentage":
          result = parseFloat(display) / 100;
          break;
        case "exponent":
          result = Math.pow(parseFloat(display), 2);
          break;
        default:
          break;
      }
      setDisplay(result.toString());
    } catch (error) {
      setDisplay("Error");
    }
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;
        
      // Numpad and number keys
      if (/[0-9]/.test(key)) {
        handleButtonClick(key);
      }

      // Operators
      if (["+", "-", "*", "/"].includes(key)) {
        handleButtonClick(key);
      }

      // Enter key (equals)
      if (key === "Enter") {
        handleEquals();
      }

      // Escape key (clear)
      if (key === "Escape") {
        handleClear();
      }

      // Decimal point
      if (key === ".") {
        handleButtonClick(".");
      }

      if(key === "Backspace"){
        handleBackspaceClick()
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [display, isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div
      className="calculator"
      ref={calculatorRef}
      onClick={handleFocus} // Focus on click
      onBlur={handleBlur} // Handle blur
      tabIndex={0}
    >
      <div className="display">{display}</div>
      <div className="buttons">
        {showNumbers && (
          <>
            <button onClick={handleClear}>C</button>
            <button onClick={() => handleAdvancedOperation("sqrt")}>√</button>
            <button onClick={() => handleAdvancedOperation("percentage")}>
              %
            </button>
            <button onClick={() => handleAdvancedOperation("exponent")}>
              x²
            </button>
            <button onClick={() => handleButtonClick("/")}>/</button>
          </>
        )}

        {showNumbers && (
          <>
            <button onClick={() => handleButtonClick("7")}>7</button>
            <button onClick={() => handleButtonClick("8")}>8</button>
            <button onClick={() => handleButtonClick("9")}>9</button>
          </>
        )}
        <button onClick={() => handleButtonClick("*")}>*</button>

        {showNumbers && (
          <>
            <button onClick={() => handleButtonClick("4")}>4</button>
            <button onClick={() => handleButtonClick("5")}>5</button>
            <button onClick={() => handleButtonClick("6")}>6</button>
          </>
        )}
        <button onClick={() => handleButtonClick("-")}>-</button>

        {showNumbers && (
          <>
            <button onClick={() => handleButtonClick("1")}>1</button>
            <button onClick={() => handleButtonClick("2")}>2</button>
            <button onClick={() => handleButtonClick("3")}>3</button>
          </>
        )}
        <button onClick={() => handleButtonClick("+")}>+</button>

        {showNumbers && (
          <>
            <button onClick={() => handleButtonClick("0")}>0</button>
            <button onClick={() => handleButtonClick(".")}>.</button>
          </>
        )}
        <button onClick={handleEquals}>=</button>
      </div>
      <button
        className="toggle-button"
        onClick={() => setShowNumbers(!showNumbers)}
      >
        {showNumbers ? "Hide Numbers" : "Show Numbers"}
      </button>
    </div>
  );
};

export default Calculator;
