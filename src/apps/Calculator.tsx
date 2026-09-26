import React, { useState, useEffect } from 'react';

interface CalculatorProps {
  windowId?: string;
}

export default function Calculator({ windowId }: CalculatorProps) {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [resetDisplay, setResetDisplay] = useState(false);

  // Обработка клавиш
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      
      if (/[0-9]/.test(key)) {
        handleDigit(key);
      } else if (key === '.' || key === ',') {
        handleDecimal();
      } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        handleOperation(key);
      } else if (key === 'Enter' || key === '=') {
        handleEquals();
      } else if (key === 'Escape' || key === 'c' || key === 'C') {
        handleClear();
      } else if (key === 'Backspace') {
        handleBackspace();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, previousValue, operation, resetDisplay]);

  const handleDigit = (digit: string) => {
    if (resetDisplay) {
      setDisplay(digit);
      setResetDisplay(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const handleDecimal = () => {
    if (resetDisplay) {
      setDisplay('0.');
      setResetDisplay(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperation = (op: string) => {
    const current = parseFloat(display);
    
    if (previousValue !== null && operation) {
      const result = calculate(previousValue, current, operation);
      setPreviousValue(result);
      setDisplay(result.toString());
    } else {
      setPreviousValue(current);
    }
    
    setOperation(op);
    setResetDisplay(true);
  };

  const handleEquals = () => {
    if (previousValue === null || !operation) return;
    
    const current = parseFloat(display);
    const result = calculate(previousValue, current, operation);
    
    setDisplay(result.toString());
    setPreviousValue(null);
    setOperation(null);
    setResetDisplay(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setResetDisplay(false);
  };

  const handleBackspace = () => {
    if (display.length === 1 || (display.length === 2 && display.startsWith('-'))) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const buttons = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+'],
  ];

  return (
    <div className="h-full w-full flex flex-col bg-gray-200 p-2">
      {/* Display */}
      <div 
        className="bg-white border-2 mb-2 p-2 text-right font-mono text-xl h-10 flex items-center justify-end overflow-hidden"
        style={{ boxShadow: 'inset 1px 1px 0 #808080, inset -1px -1px 0 #ffffff' }}
      >
        {display}
      </div>

      {/* Buttons */}
      <div className="flex-1 grid grid-cols-4 gap-1">
        {/* Clear button */}
        <button
          onClick={handleClear}
          className="col-span-4 bg-gray-300 border-2 font-bold text-sm hover:bg-gray-400 active:bg-gray-500"
          style={{ boxShadow: 'inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080' }}
        >
          C
        </button>

        {/* Number and operation buttons */}
        {buttons.map((row, rowIndex) => (
          row.map((btn, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => {
                if (btn === '=') {
                  handleEquals();
                } else if (['+', '-', '*', '/'].includes(btn)) {
                  handleOperation(btn);
                } else if (btn === '.') {
                  handleDecimal();
                } else {
                  handleDigit(btn);
                }
              }}
              className={`border-2 font-bold text-sm hover:brightness-110 active:brightness-90 ${
                ['+', '-', '*', '/', '='].includes(btn)
                  ? 'bg-blue-200 hover:bg-blue-300'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              style={{ boxShadow: 'inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080' }}
            >
              {btn}
            </button>
          ))
        ))}
      </div>
    </div>
  );
}
