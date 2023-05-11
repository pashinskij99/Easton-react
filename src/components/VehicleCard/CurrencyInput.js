import { Input } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';

const CurrencyInput = ({ value, onChange, onBlur, ...props }) => {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    if (value !== undefined) {
      setDisplayValue(`$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`);
    }
  }, [value]);

  const handleChange = (event) => {
    const newValue = event.target.value.replace(/[^\d.]/g, '');
    setDisplayValue(`$${newValue}`);
  };

  const handleBlur = (event) => {
    const parsedValue = parseFloat(event.target.value.replace(/[^\d.]/g, ''));
    setDisplayValue(`$${parsedValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`);
    if (onChange) {
      onChange(parsedValue);
    }
    if (onBlur) {
      onBlur(event, parsedValue);
    }
  };

  return (
    <input
      {...props}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};

export default React.memo(CurrencyInput);
