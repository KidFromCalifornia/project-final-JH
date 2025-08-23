import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const SelectInput = ({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  ...props
}) => (
  <FormControl fullWidth margin="normal" required={required}>
    <InputLabel id={`${name}-label`}>{label}</InputLabel>
    <Select
      labelId={`${name}-label`}
      id={name}
      name={name}
      value={value}
      label={label}
      onChange={onChange}
      {...props}
    >
      {options.map((opt) =>
        typeof opt === "object" ? (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ) : (
          <MenuItem key={opt} value={opt}>
            {opt}
          </MenuItem>
        )
      )}
    </Select>
  </FormControl>
);

export default SelectInput;
