import React from "react";
import { Checkbox, FormControlLabel } from "@mui/material";

const CheckboxInput = ({ label, name, checked, onChange, ...props }) => (
  <FormControlLabel
    control={
      <Checkbox
        id={name}
        name={name}
        checked={checked}
        onChange={onChange}
        {...props}
      />
    }
    label={label}
  />
);

export default CheckboxInput;
