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
  <span class="text-body-1 font-weight-medium">{{ type }}</span>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    required: true,
  },
})

const resolveRole = () => {
  switch (props.type) {
  case 'Monthly':
    return {
      color: 'primary',
      icon: 'tabler-calendar',
    }

  case 'Annually':
    return {
      color: 'success',
      icon: 'tabler-calendar',
    }
  default:
    return {
      color: 'secondary',
      icon: 'tabler-dot',
    }
  }
}
</script>
