import React from "react";

const TextInput = ({
  label,
  name,
  value,
  onChange,
  required = false,
  ...props
}) => (
  <label htmlFor={name} style={{ display: "block", marginBottom: "1rem" }}>
    {label}
    <input
      type="text"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      style={{ marginLeft: "0.5rem", padding: "0.25rem" }}
      {...props}
    />
  </label>
);

export default TextInput;
