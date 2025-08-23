import React from "react";
import { TextField } from "@mui/material";

const TextInput = ({
  label,
  name,
  value,
  onChange,
  required = false,
  ...props
}) => (
  <TextField
    label={label}
    name={name}
    value={value}
    onChange={onChange}
    required={required}
    fullWidth
    margin="normal"
    variant="outlined"
    {...props}
  />
);

export default TextInput;
