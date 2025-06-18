import Swal from "sweetalert2"

export const SwalDelete = async () => {
  const { isConfirmed } = await Swal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to recover this data!',
    icon: 'warning',
    
    showCancelButton: true,
    
    confirmButtonText: 'Yes, delete it!',
    confirmButtonColor: '#9A403A',
    customClass: {
      confirmButton: 'text-white',
      cancelButton: '',
    },
    
    cancelButtonText: 'No, cancel!',
    cancelButtonColor: '#CDCDCD',
  })

  return isConfirmed
}

export const SwalUpdateStatus = async status => {
  const { isConfirmed } = await Swal.fire({
    title: 'Are you sure?',
    text: `You want to change the status to ${status}!`,
    icon: 'warning',
    
    showCancelButton: true,
    
    confirmButtonText: 'Yes, change it!',
    confirmButtonColor: '#9A403A',
    customClass: {
      confirmButton: 'text-white',
      cancelButton: '',
    },
    
    cancelButtonText: 'No, cancel!',
    cancelButtonColor: '#CDCDCD',
  })

  return isConfirmed
}
