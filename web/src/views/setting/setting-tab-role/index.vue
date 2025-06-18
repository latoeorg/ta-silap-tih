<template>
  <div>
    <SettingHeader
      title="Roles"
      subtitle="A role provided access to predefined menus and features so that depending on assigned role an administrator can have access to what he need"
    />

    <div class="d-flex align-center justify-end flex-wrap gap-4">
      <div style="inline-size: 20rem;">
        <AppTextField
          v-model="table_options.search"
          density="compact"
          placeholder="Search ..."
          append-inner-icon="tabler-search"
        />
      </div>

      <VBtn
        v-if="IsCan('POST_ROLES')"
        @click="onOpen(true)"
      >
        <VIcon
          start
          icon="tabler-plus"
        />
        Add Role
      </VBtn>
    </div>

    <VDataTableServer
      v-model:options="table_options"
      v-model:items-per-page="table_options.page_size"
      v-model:page="table_options.page"
      :items-length="table_options.total_items"
      :search="table_options.search"
      :headers="headers"
      :items="reports"
      :loading="loading"
      class="text-no-wrap"
      @update:options="refetch"
    >
      <!-- Actions -->
      <template #item.actions="{ item }">
        <div class="d-flex gap-1 justify-end">
          <IconBtn
            v-if="IsCan('PUT_ROLES')"
            @click="onUpdate(item.id)"
          >
            <VIcon icon="tabler-edit" />
          </IconBtn>
        </div>
      </template>
    </VDataTableServer>
  </div>

  <SettingTabRoleFormDrawer
    :open="open"
    @on-open="onOpen"
  />
</template>

<script setup>
import SettingHeader from '@/views/setting/setting-header.vue'
import SettingTabRoleFormDrawer from './setting-tab-role-form-drawer.vue'

const headers = ref([
  { title: 'Role',  key: 'name' },
  { title: 'Description',  key: 'description', value: val => val.description || 'N/A' },
  { title: 'Actions', align: 'end',  key: 'actions', sortable: false },
])

const store = useVuex()

const open = ref(false)

const onOpen = value => open.value = value

const onUpdate = id => {
  store.commit('setting/role/SET_IS_UPDATE', true)
  store.dispatch('setting/role/setFormUpdate', id)
  onOpen(true)
}

const reports = computed(() => store.state.setting.role.reports)
const loading = computed(() => store.state.setting.role.loading.reports)

const table_options = computed({
  get: () => store.state.setting.role.table_options,
  set: value => store.commit('setting/role/SET_TABLE_OPTIONS', value),
})

const refetch = () => store.dispatch('setting/role/getReports')

onMounted(() => refetch())
</script>
