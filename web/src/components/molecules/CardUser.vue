<template>
  <div
    v-if="user"
    class="d-flex align-center"
  >
    <VAvatar
      size="34"
      :variant="!user?.photo ? 'tonal' : undefined"
      class="me-3"
    >
      <VImg
        v-if="user?.photo"
        :src="`${user?.photo}`"
        cover
        style="object-position: center;"
      />
      <span v-else>{{ avatarText(user?.name) }}</span>
    </VAvatar>
    <div class="d-flex flex-column">
      <h6 class="text-base">
        <RouterLink
          :to="user?.id ? `/user/${user?.id}` : '#'"
          class="font-weight-medium text-link"
        >
          {{ user?.name }}
        </RouterLink>
      </h6>
      <span class="text-sm text-medium-emphasis">{{ user?.email }}</span>
    </div>
  </div>

  <div v-else>
    -
  </div>
</template>

<script setup>
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
})
</script>
