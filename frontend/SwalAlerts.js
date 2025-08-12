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
