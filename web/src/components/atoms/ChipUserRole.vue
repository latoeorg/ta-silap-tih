<template>
  <VAvatar
    size="30"
    variant="tonal"
    :color="resolveRole()?.color"
    class="me-2"
  >
    <VIcon
      :icon="resolveRole()?.icon"
      size="18"
    />
  </VAvatar>
  <span class="text-body-1 font-weight-medium">{{ role }}</span>
</template>

<script setup>
const props = defineProps({
  role: {
    type: String,
    required: true,
  },
})

const resolveRole = () => {
  switch (props.role) {
  case 'B One Consulting':
    return {
      color: 'primary',
      icon: 'tabler-building-skyscraper',
    }

  case 'Promotor':
    return {
      color: 'success',
      icon: 'tabler-user-check',
    }

  case 'Staff':
    return {
      color: 'info',
      icon: 'tabler-user',
    }
  
  default:
    return {
      color: 'secondary',
      icon: 'tabler-user',
    }
  }
}
</script>
