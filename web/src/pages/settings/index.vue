<template>
  <VRow>
    <VCol
      cols="12"
      md="3"
      class="overflow-auto"
    >
      <div class="setting-tab-navigation">
        <div
          v-for="(item, i) in navigation"
          :key="i"
        >
          <h6
            v-if="item.header"
            :class="`text-h6 mb-4 ${i !== 0 && 'mt-5'}`"
          >
            {{ item.header }}
          </h6>

          <VTabs
            v-model="activeTab"
            direction="vertical"
            class="v-tabs-pill disable-tab-transition"
          >
            <VTab
              v-for="(tabItem, j) in item.items"
              :key="j"
              :prepend-icon="tabItem.icon"
              :value="tabItem.title"
              @click="handleChangeTab(tabItem.title)"
            >
              {{ tabItem.title }}
            </VTab>
          </VTabs>
        </div>
      </div>
    </VCol>

    <VCol
      cols="12"
      md="9"
    >
      <div class="setting-tab-content">
        <SettingTabProfile v-if="activeTab == key.Profile" />
        <SettingTabAccount v-if="activeTab == key.Account" />
        <SettingTabRole v-if="activeTab == key.Roles" />
        <SettingTabPermission v-if="activeTab == key.Permissions" />
      </div>
    </VCol>
  </VRow>
</template>

<script setup>
import SettingTabAccount from '@/views/setting/setting-tab-account/index.vue'
import SettingTabPermission from '@/views/setting/setting-tab-permission/index.vue'
import SettingTabProfile from '@/views/setting/setting-tab-profile/index.vue'
import SettingTabRole from '@/views/setting/setting-tab-role/index.vue'

const route = useRoute("settings")
const router = useRouter()

const activeTab = computed({
  get: () => route.query.tab || key.Profile,
  set: () => route.query.tab, 
})

const key = {
  Profile: 'profile',
  Account: 'account',
  Brochure: 'brochure',
  Roles: 'roles',
  Permissions: 'permissions',
}

const navigation = [
  {
    header: 'User',
    items: [
      { 
        title: key.Profile, 
        icon: 'tabler-user', 
      },
      { 
        title: key.Account, 
        icon: 'tabler-user-shield', 
      },
    ],
  },
  {
    header: 'Security',
    items: [
      { 
        title: key.Roles, 
        icon: 'tabler-user-check', 
        hidden: !IsCan("GET_ROLES"),
      },
      { 
        title: key.Permissions, 
        icon: 'tabler-shield-check',
        hidden: !IsCan("GET_PERMISSIONS"),
      },
    ],
  },
].map(section => ({
  ...section,
  items: section.items.filter(subItem => !subItem.hidden),
})).filter(section => section.items.length > 0)

const handleChangeTab = tab => {
  router.push({ query: { tab } })
}
</script>


<style lang="scss">
.setting-tab-navigation {
  position: sticky;
  overflow-y: auto;
  padding-right: 1rem;
  min-height: 70vh;
}
</style>
