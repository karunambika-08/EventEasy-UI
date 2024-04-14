import Swal from 'sweetalert2'
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

export {Toast}