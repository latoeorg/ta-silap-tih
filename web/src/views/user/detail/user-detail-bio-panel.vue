<template>
  <VRow>
    <!-- SECTION User Details -->
    <VCol cols="12">
      <VCard v-if="user">
        <VCardText class="text-center pt-15">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded
            :size="100"
            :color="!user.photo ? 'primary' : undefined"
            :variant="!user.photo ? 'tonal' : undefined"
          >
            <VImg
              v-if="user.photo"
              :src="user.photo"
            />
            <span
              v-else
              class="text-5xl font-weight-medium"
            >
              {{ avatarText(user.first_name + ' ' + user.last_name) }}
            </span>
          </VAvatar>

          <h6 class="text-h4 mt-4">
            {{ user.first_name }} {{ user.last_name }}
          </h6>

          <div class="mt-3">
            <ChipUserRole :role="user.role_name" />
          </div>
        </VCardText>

        <VDivider />

        <VCardText>
          <p class="text-sm text-uppercase text-disabled">
            Details
          </p>

          <!-- 👉 User Details list -->
          <VList class="card-list mt-2">
            <VListItem
              v-for="(item, index) in [
                {key: 'Username', value: user.username},
                {key: 'Email', value: user.email},
                {key: 'Phone', value: user.phone},
                {key: 'Birth Date', value: formatDate(user.birth_date)},
                {key: 'Status', value: user.is_active ? 'Active' : 'Inactive'},
                {key: 'Last Activity', value: formatCalendar(user.last_activity)},
              ]"
              :key="`User Detail ${item.key} ${index}`"
            >
              <VListItemTitle>
                <h6 class="text-h6">
                  {{ item.key }}:
                  <span class="text-body-1">
                    {{ item.value || "-" }}
                  </span>
                </h6>
              </VListItemTitle>
            </VListItem>
          </VList>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<script setup>
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
})
</script>
