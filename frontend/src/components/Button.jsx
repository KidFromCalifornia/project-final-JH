import React from "react";

const Button = ({ children, style = {}, ...props }) => (
  <button
    style={{
      backgroundColor: "#170351",
      color: "#fff",
      padding: "0.5rem 1rem",
      border: "none",
      cursor: "pointer",
      ...style,
    }}
    {...props}
  >
    {children}
  </button>
);

export default Button;
