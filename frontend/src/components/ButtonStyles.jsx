import styled from "styled-components";

const ButtonDark = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textLight};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadow};
`;

const ButtonLight = styled.button`
  background-color: ${({ theme }) => theme.colors.textLight};
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadow};

  &:hover {
    transform: scaleY(1.05);
  }
  &:active {
    transform: scaleY(0.95);
    box-shadow: inset 0 0 5px ${({ theme }) => theme.shadow};
  }
`;

export { ButtonDark, ButtonLight };
