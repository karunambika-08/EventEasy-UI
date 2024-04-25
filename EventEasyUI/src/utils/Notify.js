import Swal from 'sweetalert2'
import deleteIcon from '../assets/delete.svg';
const Toast = Swal.mixin({
    toast: true,
    position: 'bottom',
    iconColor: 'black',

    customClass: {
      popup: 'colored-toast',
    },
    showConfirmButton: false,
    timer: 1500,
    // timerProgressBar: true,
  })

const deleteAlert= async ()=>{
  return await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    imageUrl: deleteIcon,
    imageWidth: 300,
    imageHeight: 200,
    imageAlt: "Are you sure to delete?",
    showCancelButton: true,
    confirmButtonColor: "#0064E0",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  })
}

export {Toast,deleteAlert}