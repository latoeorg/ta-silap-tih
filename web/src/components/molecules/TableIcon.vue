<template>
  <div
    v-for="(list, index ) in items"
    :key="index"
    class="d-flex justify-space-between align-items-center py-3"
    :class="{ 'border-b': index !== items.length - 1 && !borderless }"
  >
    <div class="d-flex align-items-center gap-2 font-weight-medium">
      <VIcon
        :icon="list.icon"
        size="20"
      />

      {{ list.label }}
    </div>

    <div :class="list.valueClass">
      {{ list.value || '-' }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  borderless: {
    type: Boolean,
    default: false,
  },
})
</script>
