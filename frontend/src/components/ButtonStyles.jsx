import styled from "styled-components";

const ButtonDark = styled.button`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.textLight};
  padding: ${({ theme }) => theme.spacing.sm};
  ${({ theme }) => theme.spacing.small};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadow};

  &:hover {
    background-color: ${({ theme }) => theme.colors.textDark};
    transform: scaleY(1.05);
  }

  &:active {
    transform: scaleY(0.95);
    box-shadow: inset 0 0 5px ${({ theme }) => theme.shadow};
  }
`;

const ButtonLight = styled.button`
  background-color: ${({ theme }) => theme.colors.textLight};
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.sm};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadow};

  &:hover {
    transform: scaleY(1.05);
    background-color: ${({ theme }) => theme.colors.background};
  }
  &:active {
    transform: scaleY(0.95);
    box-shadow: inset 0 0 5px ${({ theme }) => theme.shadow};
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const NavButton = styled(ButtonDark)`
  text-decoration: none;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.textLight};

  &:hover {
    background-color: ${({ theme }) => theme.colors.textDark};
    transform: scaleY(1.05);
  }

  &:active {
    transform: scaleY(0.95);
    box-shadow: inset 0 0 5px ${({ theme }) => theme.shadow};
  }
`;

export { ButtonDark, ButtonLight, NavButton };
