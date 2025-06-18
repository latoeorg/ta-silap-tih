<template>
  <VRow
    v-if="user"
    class="container"
  >
    <VCol
      cols="12"
      md="5"
      lg="4"
    >
      <UserDetailBioPanel :user="user" />
    </VCol>

    <VCol
      cols="12"
      md="7"
      lg="8"
    >
      <VCard :title="user.username">
        <VDivider />
        <VCardText>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae, facilis aliquid eveniet a cupiditate totam fugit provident suscipit rem autem modi harum exercitationem eligendi accusantium officiis consectetur nihil adipisci quo.
        </VCardText>
      </VCard>
      <!--
        <VTabs
        v-model="userTab"
        class="v-tabs-pill"
        >
        <VTab
        v-for="tab in tabs"
        :key="tab.icon"
        >
        <VIcon
        :size="18"
        :icon="tab.icon"
        class="me-1"
        />
        <span>{{ tab.title }}</span>
        </VTab>
        </VTabs> 
      -->

      <!--
        <VWindow
        v-model="userTab"
        class="mt-6 disable-tab-transition"
        :touch="false"
        >
        <VWindowItem>
        <UserTabAccount />
        </VWindowItem>

        <VWindowItem>
        <UserTabSecurity />
        </VWindowItem>

        <VWindowItem>
        <UserTabBillingsPlans />
        </VWindowItem>

        <VWindowItem>
        <UserTabNotifications />
        </VWindowItem>

        <VWindowItem>
        <UserTabConnections />
        </VWindowItem>
        </VWindow> 
      -->
    </VCol>
  </VRow>
  <VCard v-else>
    <VCardTitle class="text-center">
      No User Found
    </VCardTitle>
  </VCard>
</template>

<script setup>
import UserDetailBioPanel from '@/views/user/detail/user-detail-bio-panel.vue'

const store = useVuex()
const route = useRoute()
const username = ref(route.params.username)
const userTab = ref(null)

const tabs = [
  {
    icon: 'tabler-user-check',
    title: 'Account',
  },
  {
    icon: 'tabler-lock',
    title: 'Security',
  },
  {
    icon: 'tabler-currency-dollar',
    title: 'Billing & Plan',
  },
  {
    icon: 'tabler-bell',
    title: 'Notifications',
  },
  {
    icon: 'tabler-link',
    title: 'Connections',
  },
]

const user = computed(() => store.state.user.report)

onMounted(() => {
  store.dispatch('user/getReport', username.value)
})
</script>
