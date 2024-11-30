import React, { useState, useEffect } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function NumericInput({ min, max, defaultValue, step, precision, onChange, disabled }) {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);

  // useEffect(() => {
  //   setInputValue(value);
  // }, [value, disabled]);

  const roundToPrecision = (value) => {
    const factor = Math.pow(10, precision);
    return Math.round(value * factor) / factor;
  };

  const handleIncrement = () => {
    const newValue = roundToPrecision(inputValue + step);
    setInputValue(newValue);
    if (onChange) onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = roundToPrecision(inputValue - step);
    setInputValue(newValue);
    if (onChange) onChange(newValue);
  };

  const handleChange = (e) => {
    const value = e.target.value;

    if (!disabled) {
      if (/^-?\d*\.?\d*$/.test(value)) {
        setInputValue(value);
      }
    }
    else {
      setInputValue('');
    }
  };

  const handleBlur = () => {
    let newValue = parseFloat(inputValue);
    if (isNaN(newValue)) {
      newValue = min;
    }
    newValue = roundToPrecision(Math.max(min, Math.min(newValue, max)));
    setInputValue(newValue.toFixed(precision));
    if (onChange) onChange(newValue);
    setIsFocused(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  return (
    <div style={styles.container}>
      <input
        type="text"
        value={disabled ? '' : (isFocused ? inputValue : parseFloat(inputValue).toFixed(precision))}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        disabled={disabled}
        style={styles.input}
      />
      <div style={styles.controls}>
        <button onClick={handleIncrement} style={styles.button} disabled={inputValue >= max || disabled}>
          <KeyboardArrowUpIcon />
        </button>
        <button onClick={handleDecrement} style={styles.button} disabled={inputValue <= min || disabled}>
          <KeyboardArrowDownIcon />
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    overflow: 'hidden',
    width: '120px',
  },
  input: {
    width: '100%',
    padding: '8px',
    border: 'none',
    fontSize: '16px',
    textAlign: 'center',
    outline: 'none',
  },
  controls: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderLeft: '1px solid #d1d5db',
    backgroundColor: '#f0f0f0',
  },
  button: {
    width: '100%',
    padding: '4px',
    fontSize: '14px',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent',
    outline: 'none',
  },
};

export default NumericInput;
