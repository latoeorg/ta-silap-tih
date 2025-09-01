<template>
  <div>
    <VCard title="Penilaian">
      <VDivider />

      <VCardText>
        <div class="d-flex align-center justify-end flex-wrap gap-4">
          <div style="inline-size: 20rem;">
            <AppTextField
              v-model="table_options.search"
              density="compact"
              placeholder="Cari Penilaian..."
              append-inner-icon="tabler-search"
            />
          </div>

          <VBtn @click="handleDrawerForm(true)">
            <VIcon
              start
              icon="tabler-plus"
            />
            Tambah Penilaian
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
          :items="courses"
          :loading="loading"
          class="text-no-wrap"
          @update:options="refetch"
        >
          <template #item.name="{ item }">
            <span class="font-weight-medium">{{ item.name }}</span>
          </template>

          <template #item.subject="{ item }">
            <span>{{ item.subject?.name || '-' }}</span>
          </template>

          <template #item.teacher="{ item }">
            <CardUser
              v-if="item.teacher"
              :user="item.teacher"
            />
            <span v-else>-</span>
          </template>

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

    <CourseFormDrawer
      :open="drawerForm"
      @handle-close="handleDrawerForm"
    />
  </div>
</template>

<script setup>
import CourseFormDrawer from './course-form-drawer.vue'

const headers = ref([
  { title: 'Nama Penilaian',  key: 'name' },
  { title: 'Subjek',  key: 'subject' },
  { title: 'Pengajar',  key: 'teacher' },
  { title: 'Tindakan', align: 'end',  key: 'actions', sortable: false },
])

const drawerForm = ref(false)
const store = useVuex()

const handleDrawerForm = value => {
  // When opening the form, fetch necessary data like subjects and teachers
  if(value) store.dispatch('course/fetchPrerequisites')
  drawerForm.value = value
}

const handleUpdate = async id => {
  await store.dispatch('course/setFormUpdate', id)
  handleDrawerForm(true)
}

const handleDelete = async id => {
  const confirm = await SwalDelete() // Assuming SwalDelete is a global helper
  if(confirm) {
    const success = await store.dispatch("course/delete", id)
    if(success) refetch()
  }
}

// Computed properties pointing to the 'course' module in the Vuex store
const loading = computed(() => store.state.course.loading.courses)
const courses = computed(() => store.state.course.courses)

const table_options = computed({
  get: () => store.state.course.table_options,
  set: value => store.commit('course/SET_TABLE_OPTIONS', value),
})

// Function to refetch data
const refetch = () => store.dispatch('course/getCourses')

// Fetch data when the component is mounted
onMounted(() => refetch())
</script>
