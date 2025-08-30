<template>
  <div>
    <VCard :title="title">
      <VDivider />

      <VCardText>
        <div class="d-flex align-center justify-end flex-wrap gap-4">
          <div style="inline-size: 20rem;">
            <AppTextField
              v-model="table_options.search"
              density="compact"
              placeholder="Cari ..."
              append-inner-icon="tabler-search"
            />
          </div>

          <VBtn
            v-if="!hideAddButton"
            @click="handleDrawerForm(true)"
          >
            <VIcon
              start
              icon="tabler-plus"
            />
            Tambah
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
import UserFormDrawer from '../../views/user/user-form-drawer.vue'

const props = defineProps({
  hideAddButton: {
    type: Boolean,
    default: false,
  },
  hideActions: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Pengurusan Pengguna',
  },
  
  role: {
    type: String,
    default: 'STUDENT',
  },
  classGroupId: {
    type: String,
    default: '',
  },
})

const headers = ref(
  [
    { title: 'Pengguna',  key: 'first_name' },
    { title: 'E-mel',  key: 'email' },
    { title: 'Peranan',  key: 'role' },
    { title: 'Tindakan', align: 'end',  key: 'actions', sortable: false },
  ].filter(h => {
    // eslint-disable-next-line sonarjs/prefer-single-boolean-return
    if(props.hideActions && (h.key == 'actions' || h.key == 'role')) return false
    
    return true
  }),
)

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

const loading = computed(() => store.state.user.loading.reports)
const reports = computed(() => store.state.user.reports)

const table_options = computed({
  get: () => store.state.user.table_options,
  set: value => store.commit('user/SET_TABLE_OPTIONS', value),
})

const refetch = () => store.dispatch('user/getReports', {
  ...(props.role ? { role: props.role } : {}),
  ...(props.classGroupId ? { class_id: props.classGroupId } : {}),
})

onMounted(() => refetch())
</script>
