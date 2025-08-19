import React from "react";

const SelectInput = ({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  ...props
}) => (
  <label htmlFor={name} style={{ display: "block", marginBottom: "1rem" }}>
    {label}
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      style={{ marginLeft: "0.5rem", padding: "0.25rem" }}
      {...props}
    >
      <option value="">Select</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </label>
);

export default SelectInput;
