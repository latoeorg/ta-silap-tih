<template>
  <div>
    <VCard :title="`${role == 'STAFF' ? 'Staff' : 'Promotor'} List` ">
      <VDivider />

      <VCardText>
        <div class="d-flex align-center justify-end flex-wrap gap-4">
          <div style="inline-size: 20rem;">
            <AppTextField
              v-model="table_options.search"
              density="compact"
              placeholder="Search ..."
              append-inner-icon="tabler-search"
            />
          </div>

          <VBtn @click="handleDrawerForm(true)">
            <VIcon
              start
              icon="tabler-plus"
            />
            Add User
          </VBtn>
        </div>
      </VCardText>

      <VDivider />

      <VCardText class="px-0 pt-0">
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
          <template #item.first_name="{ item }">
            <CardUser :user="item" />
          </template>
          
          <template #item.role_name="{ item }">
            <VAvatar
              size="30"
              variant="tonal"
              :color="resolveRole(item.role_name)?.color"
              class="me-2"
            >
              <VIcon
                :icon="resolveRole(item.role_name)?.icon"
                size="18"
              />
            </VAvatar>
            <span class="text-body-1 font-weight-medium">{{ item.role_name }}</span>
          </template>


          <!-- Actions -->
          <template #item.actions="{ item }">
            <div class="d-flex gap-1 justify-end">
              <IconBtn @click="handleUpdate(item.id)">
                <VIcon icon="tabler-edit" />
              </IconBtn>
              <IconBtn @click="handleDelete(item.id)">
                <VIcon icon="tabler-trash" />
              </IconBtn>
            </div>
          </template>
        </VDataTableServer>
      </VCardText>
    </VCard>

    <UserFormDrawer
      :open="drawerForm"
      :role="role"
      @handle-close="handleDrawerForm"
    />
  </div>
</template>


<script setup>
import UserFormDrawer from './user-form-drawer.vue'

const props = defineProps({
  role: {
    type: String,
    default: 'STAFF',
  },
})

const headers = ref([
  { title: 'User',  key: 'first_name' },
  { title: 'email',  key: 'email' },
  { title: 'Role',  key: 'role' },
  { title: 'Actions', align: 'end',  key: 'actions', sortable: false },
])

const drawerForm = ref(false)

const store = useVuex()

const handleDrawerForm = value => {
  if(value) store.dispatch('user/fetchBeforeForm')
  drawerForm.value = value
}

const handleUpdate = async id => {
  await store.dispatch('user/setFormUpdate', id)
  handleDrawerForm(true)
}

const handleDelete = async id => {
  const confirm = await SwalDelete()
  if(confirm) await store.dispatch("user/delete", id).then(res => {
    if(res) refetch()
  })
}

const resolveRole = role => {
  switch (role) {
  case 'B One Consulting':
    return {
      color: 'primary',
      icon: 'tabler-building-skyscraper',
    }

  case 'Promotor':
    return {
      color: 'success',
      icon: 'tabler-user-check',
    }

  case 'Staff':
    return {
      color: 'info',
      icon: 'tabler-user',
    }
  
  default:
    return {
      color: 'secondary',
      icon: 'tabler-user',
    }
  }
}

const loading = computed(() => store.state.user.loading.reports)
const reports = computed(() => store.state.user.reports)

const table_options = computed({
  get: () => store.state.user.table_options,
  set: value => store.commit('user/SET_TABLE_OPTIONS', value),
})

const refetch = () => store.dispatch('user/getReports', {
  ...(props.role == 'STAFF' ? { role_exclude: 'Promotor' } : {}),
  ...(props.role == 'PROMOTOR' ? { role_include: 'Promotor' } : {}),
})

onMounted(() => refetch())
</script>
