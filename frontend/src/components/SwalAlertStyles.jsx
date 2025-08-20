import styled from "styled-components";

const AlertDiv = styled.div`
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme, type }) =>
    type === "success"
      ? theme.colors.success
      : type === "error"
      ? theme.colors.error
      : type === "warning"
      ? theme.colors.error
      : theme.colors.primary};
  border: 1px solid
    ${({ theme, type }) =>
      type === "success"
        ? theme.colors.success
        : type === "error"
        ? theme.colors.error
        : type === "warning"
        ? theme.colors.error
        : theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.md};
  margin: ${({ theme }) => theme.spacing.md} 0;
  font-family: ${({ theme }) => theme.fonts.main};
  box-shadow: ${({ theme }) => theme.boxShadow};
`;

export const SwalAlertStyles = ({ message, type = "info" }) => {
  return (
    <AlertDiv type={type} role="alert">
      {message}
    </AlertDiv>
  );
};

import Swal from "sweetalert2";

export const showAlert = (options) => {
  return Swal.fire({
    confirmButtonColor: "pink",
    background: options?.theme?.colors?.background || "white",
    color: options?.theme?.colors?.mainText || "black",
    fontFamily: options?.theme?.fonts?.main || "Avenir, sans-serif",
    width: "20rem",
    heightAuto: true,
    imageUrl:
      "https://cdn4.iconfinder.com/data/icons/valetine-s-emoji-ii/800/Sad_Big_Eyes-1024.png",
    imageWidth: 200,
    icon: "undefined",
    customClass: {
      popup: "swal-popup-custom",
      title: "swal-title-custom",
      confirmButton: "swal-confirm-custom",
      icon: "swal-hide-icon",
    },
    ...options,
  });
};
