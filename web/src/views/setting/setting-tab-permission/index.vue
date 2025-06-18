<template>
  <div>
    <SettingHeader
      title="Permissions"
      subtitle="Manage user permissions"
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
        v-if="IsCan('POST_PERMISSIONS')"
        @click="onOpen(true)"
      >
        <VIcon
          start
          icon="tabler-plus"
        />
        Add Permission
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
      style="height: 60vh;"
      fixed-header
      @update:options="refetch"
    >
      <template #bottom />
    
      <template #item.code="{ item }">
        <span class="text-primary cursor-pointer fw-500 text-sm">#{{ item.code }}</span>
      </template>

      <template #item.roles="{ item }">
        <div class="d-flex gap-1">
          <VChip
            v-for="role in item.roles.slice(0, 3)"
            :key="role"
            label
            color="primary"
          >
            {{ role.role_name }}
          </VChip>

          <VChip
            v-if="item.roles.length > 3"
            label
            color="primary"
          >
            +{{ item.roles.length - 3 }}
          </VChip>

          <VChip
            v-if="!item.roles.length"
            label
            color="info"
          >
            ALL
          </VChip>
        </div>
      </template>

      <template #item.api_url="{ item }">
        <div class="d-flex gap-3">
          <VChip
            label
            :color="item.api_method === 'GET' ? 'success' : 'error'"
          >
            {{ item.api_method }}
          </VChip>

          <span>{{ item.api_url }}</span>
        </div>
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex gap-1 justify-end">
          <IconBtn
            v-if="IsCan('PUT_PERMISSIONS')"
            @click="onUpdate(item.id)"
          >
            <VIcon icon="tabler-edit" />
          </IconBtn>
        </div>
      </template>
    </VDataTableServer>
  </div>

  <FormDrawer
    :open="open"
    @on-open="onOpen"
  />
</template>

<script setup>
import SettingHeader from '@/views/setting/setting-header.vue'
import FormDrawer from './setting-tab-permission-form-drawer.vue'

const headers = ref([
  { title: 'Permission Code',  key: 'code' },
  { title: 'Name',  key: 'name' },
  { title: 'Description',  key: 'description', value: val => val.description || 'N/A' },
  { title: 'Roles',  key: 'roles' },
  { title: 'Endpoint',  key: 'api_url' },
  { title: 'Actions', align: 'end',  key: 'actions', sortable: false },
])

const store = useVuex()

const open = ref(false)
const onOpen = value => open.value = value

const onUpdate = id => {
  store.dispatch('setting/permission/setFormUpdate', id)
  onOpen(true)
}

const reports = computed(() => store.state.setting.permission.reports)
const loading = computed(() => store.state.setting.permission.loading.reports)

const table_options = computed({
  get: () => store.state.setting.permission.table_options,
  set: value => store.commit('setting/permission/SET_TABLE_OPTIONS', value),
})

const refetch = () => store.dispatch('setting/permission/getReports')

onMounted(() => refetch())
</script>
