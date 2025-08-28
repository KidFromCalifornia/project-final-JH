import { Alert } from "@mui/material";

export const SwalAlertStyles = ({ message, type = "error" }) => {
  return (
    <Alert severity={type} sx={{ my: 2 }}>
      {message}
    </Alert>
  );
};

// SweetAlert modal logic remains unchanged below
import Swal from "sweetalert2";
import spiltCoffeeError from "../assets/images/spiltCoffeeError.svg";

export const showAlert = (options) => {
  return Swal.fire({
    confirmButtonColor: options?.theme?.colors?.primary || "#3085d6",
    background: options?.theme?.colors?.background || "white",
    color: options?.theme?.colors?.textDark || "black",
    fontFamily: options?.theme?.fonts?.main || "Avenir, sans-serif",
    width: options?.theme?.containerWidths?.md || "20rem",
    heightAuto: true,
    imageUrl: options?.imageUrl || spiltCoffeeError,
    imageWidth: options?.imageWidth || 200,
    icon: "error",
    title: options?.title || "Oops! ",
    customClass: {
      popup: "swal-popup-custom",
      title: "swal-title-custom",
      confirmButton: "swal-confirm-custom",
      icon: "swal-hide-icon",
    },
    ...options,
  });
};
