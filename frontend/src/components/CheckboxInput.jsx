import styled from "styled-components";

const CheckboxContainer = styled.label`
  display: block;
  margin-bottom: 1rem;
`;

const CheckboxInput = styled.input.attrs({ type: "checkbox" })`
  margin-right: 0.5rem;
`;

const Checkbox = ({ label, name, checked, onChange, ...props }) => (
  <CheckboxContainer htmlFor={name}>
    <CheckboxInput
      id={name}
      name={name}
      checked={checked}
      onChange={onChange}
      style={{ marginRight: "0.5rem" }}
      {...props}
    />
    {label}
  </CheckboxContainer>
);

export default Checkbox;
