import Swal, { SweetAlertIcon } from "sweetalert2";


export const SweetAlert2 = (
    title: string,
    icon: SweetAlertIcon = "success",
    timer: number = 2000
) => {
    return Swal.fire({
        title,
        icon,
        toast: true,
        timer,
        position: "top-end",
        showConfirmButton: false,
    });
};

