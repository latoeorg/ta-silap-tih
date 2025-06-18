<template>
  <VChip
    :color="handleStatus().color"
    label
  >
    <VIcon
      :icon="handleStatus().icon"
      size="16"
      start
    />
    {{ handleStatus().title }}
  </VChip>
</template>

<script setup>
const props = defineProps({
  status: {
    type: String,
    required: true,
  },
})

const RestaurantBookingStatus = {
  New: "New",
  Confirmed: "Confirmed",
  Cancelled: "Cancelled",
  NoShow: "No Show",
}

const handleStatus = () => {
  switch (props.status) {
  case 'WAITING_FOR_PAYMENT':
    return {
      title: 'Waiting for payment',
      icon: 'tabler-credit-card',
      color: 'warning',
    }
  case 'PAID':
    return {
      title: 'Paid',
      icon: 'tabler-cash',
      color: 'success',
    }
    

    // Restaurant Booking Status
  case RestaurantBookingStatus.New:
    return {
      title: 'New',
      icon: 'tabler-circle-plus',
      color: 'info',
    }
  case RestaurantBookingStatus.Confirmed:
    return {
      title: 'Confirmed',
      icon: 'tabler-check',
      color: 'success',
    }
  case RestaurantBookingStatus.Cancelled:
    return {
      title: 'Cancelled',
      icon: 'tabler-x',
      color: 'error',
    }
  case RestaurantBookingStatus.NoShow:
    return {
      title: 'No Show',
      icon: 'tabler-alert-triangle',
      color: 'error',
    }


  default:
    return {
      title: 'Error',
      icon: 'tabler-alert-triangle',
      color: 'error',
    }
  }
}
</script>
