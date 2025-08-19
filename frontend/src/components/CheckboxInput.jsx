import React from "react";

const CheckboxInput = ({ label, name, checked, onChange, ...props }) => (
  <label htmlFor={name} style={{ display: "block", marginBottom: "1rem" }}>
    <input
      type="checkbox"
      id={name}
      name={name}
      checked={checked}
      onChange={onChange}
      style={{ marginRight: "0.5rem" }}
      {...props}
    />
    {label}
  </label>
);

export default CheckboxInput;
