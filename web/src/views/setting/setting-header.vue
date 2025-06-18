<template>
  <h2 class="text-h4">
    {{ title }}
  </h2>
  <p class="text-body-1">
    {{ subtitle }}
  </p>
  <VDivider class="mt-3 mb-5" />
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
})
</script>
