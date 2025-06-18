
<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    bordered
    color="success"
  >
    <div class="d-flex align-items-center gap-3 cursor-pointer">
      <div class="text-end d-none d-lg-block">
        <p class="font-weight-semibold mb-0">
          {{ user.first_name }} {{ user.last_name }}
        </p>
        <p class="text-body-2 mb-0">
          {{ user.role_name }}
        </p>
      </div>

      <VAvatar
        class="cursor-pointer"
        color="primary"
        variant="tonal"
      >
        <VImg :src="user?.photo || `https://ui-avatars.com/api/?name=${user.first_name} ${user.last_name}`" />

        <!-- SECTION Menu -->
       
      <!-- !SECTION -->
      </VAvatar>

      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="14px"
      >
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar
                    color="primary"
                    variant="tonal"
                  >
                    <VImg :src="user?.photo || `https://ui-avatars.com/api/?name=${user.first_name} ${user.last_name}`" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ user.first_name }} {{ user.last_name }}
            </VListItemTitle>
            <VListItemSubtitle>
              {{ user.role_name }}
            </VListItemSubtitle>
          </VListItem>

          <VDivider class="my-2" />


          <VListItem
            link
            href="/settings?tab=profile"
          >
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-user"
                size="22"
              />
            </template>

            <VListItemTitle>Profile</VListItemTitle>
          </VListItem>


          <VListItem
            link
            href="/settings"
          >
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-settings"
                size="22"
              />
            </template>

            <VListItemTitle>Settings</VListItemTitle>
          </VListItem>

          <!-- Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <VListItem @click="() => handleLogout()">
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-logout"
                size="22"
              />
            </template>

            <VListItemTitle>Logout</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
    </div>
  </VBadge>
</template>

<script setup>
const store = useVuex()

const handleLogout = () => store.dispatch('Logout')

const user = computed(() => store.state.app.user)
</script>
