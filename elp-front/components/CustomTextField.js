// components/CustomTextField.js
import React from 'react';
import { TextField } from '@mui/material';

const CustomTextField = ({ label, value, onChange, required, type = 'text', disabled = false }) => {
  return (
    <TextField
      fullWidth
      label={label}
      value={value}
      onChange={onChange}
      required={required}
      type={type}
      disabled={disabled}
      sx={{ mb: 1, fontSize: "0.8rem" }}
    />
  );
};

export default CustomTextField;
