<template>
  <div>
    <VCard title="Facility List">
      <VDivider />

      <VCardText>
        <div class="d-flex align-center justify-end flex-wrap gap-4">
          <div style="inline-size: 20rem;">
            <AppTextField
              v-model="table_options.search"
              density="compact"
              placeholder="Search ..."
              append-inner-icon="tabler-search"
              clearable
            />
          </div>
          <VBtn @click="toggleForm(true)">
            <VIcon
              start
              icon="tabler-plus"
            />
            Add Facility
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
          @update:options="refetch"
        >
          <template #item.name="{ item }">
            <div class="d-flex gap-3">
              <VAvatar
                :image="item.icon"
                rounded="sm"
                variant="tonal"
                color="secondary"
                icon="tabler-building"
                size="40"
              />

              <div class="d-flex flex-column justify-center">
                <p class="mb-0">
                  <span class="text-primary">{{ item.name }}</span> <br>
                  <small>{{ item.description }}</small>
                </p>
              </div>
            </div>
          </template>
          <template #item.actions="{ item }">
            <div class="d-flex gap-1 align-items-center justify-end">
              <IconBtn @click="() => handleEdit(item.id)">
                <VIcon icon="tabler-edit" />
              </IconBtn>
              <IconBtn @click="() => handleDelete(item.id)">
                <VIcon icon="tabler-trash" />
              </IconBtn>
            </div>
          </template>
        </VDataTableServer>
      </VCardText>
    </VCard>
  </div>

  <FormDrawer
    :open="drawerForm"
    @handle-close="toggleForm"
  />
</template>


<script setup>
import FormDrawer from '../../views/setup/facility/form-drawer.vue'

const headers = ref([
  { title: 'Facility',  key: 'name' },
  { title: 'Created At',  key: 'created_at', value: item => formatCalendar(item.created_at) },
  { title: 'Actions', align: 'end',  key: 'actions', sortable: false },
])

const store = useVuex()
const drawerForm = ref(false)

const toggleForm= value =>  drawerForm.value = value

const handleEdit = id => {
  store.dispatch('setup/facility/SetFormUpdate', id)
  toggleForm(true)
}

const handleDelete = async id => {
  const confirm = await SwalDelete()
  if(confirm) store.dispatch('setup/facility/Delete', id)
}

const refetch = () => store.dispatch('setup/facility/GetReports')

onMounted(() => refetch())

const table_options = computed({
  get: () => store.state.setup.facility.table_options,
  set: value => store.commit('setup/facility/SET_TABLE_OPTIONS', value),
})

const loading = computed(() => store.state.setup.facility.loading.reports)
const reports = computed(() => store.state.setup.facility.reports)
</script>
