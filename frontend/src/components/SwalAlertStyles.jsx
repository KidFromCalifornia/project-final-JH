import { Alert } from "@mui/material";

export const SwalAlertStyles = ({ message, type = "info" }) => {
  return (
    <Alert severity={type} sx={{ my: 2 }}>
      {message}
    </Alert>
  );
};

// SweetAlert modal logic remains unchanged below
import Swal from "sweetalert2";

export const showAlert = (options) => {
  return Swal.fire({
    confirmButtonColor: options?.theme?.colors?.primary || "#3085d6",
    background: options?.theme?.colors?.background || "white",
    color: options?.theme?.colors?.textDark || "black",
    fontFamily: options?.theme?.fonts?.main || "Avenir,ans-serif",
    width: options?.theme?.containerWidths?.md || "20rem",
    heightAuto: true,
    imageUrl: "frontend/assets/images/spiltCoffee.svg",
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
