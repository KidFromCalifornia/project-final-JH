// Reusable inline alert component
import React from "react";

export const SwalAlertStyles = ({ message, type = "info" }) => {
  const colorMap = {
    success: "#4BB543",
    error: "#FF3333",
    info: "#170351",
    warning: "#FFA500",
  };
  return (
    <div
      style={{
        background: "white",
        color: colorMap[type] || colorMap.info,
        border: `1px solid ${colorMap[type] || colorMap.info}`,
        borderRadius: "6px",
        padding: "1rem",
        margin: "1rem 0",
        fontFamily: "Avenir, sans-serif",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
      role="alert"
    >
      {message}
    </div>
  );
};
import Swal from "sweetalert2";

export const showAlert = (options) => {
  return Swal.fire({
    confirmButtonColor: "pink",
    background: "white",
    color: "black",
    fontfamily: "Avenir, sans-serif",
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
