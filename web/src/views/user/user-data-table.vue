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
          v-model:items-per-page="table_options.itemsPerPage"
          v-model:page="table_options.page"
          v-model="selected"
          :items-length="table_options.total_items"
          :search="table_options.search"
          :headers="headers"
          :items="reports"
          :loading="loading"
          class="text-no-wrap"

          :show-select="showSelect"
          item-value="id"
          @update:options="refetch"
        >
          <template #item.first_name="{ item }">
            <CardUser :user="item" />
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

    <UserFormDrawer
      v-if="!hideAddButton || !hideActions"
      :open="drawerForm"
      :role="role"
      @handle-close="handleDrawerForm"
      @on-submit-success="refetch"
    />
  </div>
</template>

<script setup>
import axiosInstance from "@/utils/axios"
import { computed, onMounted, ref, watch } from 'vue' // 👈 Add computed
import { toast } from "vue-sonner"
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
  courseId: {
    type: String,
    default: '',
  },

  // 👇 --- NEW PROPS ---
  showSelect: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: Array,
    default: () => [],
  },
})

// 👇 --- NEW EMIT DEFINITION ---
const emit = defineEmits(['update:modelValue'])

// 👇 --- NEW COMPUTED PROPERTY FOR V-MODEL ---
const selected = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const store = useVuex()

// --- Local State Management ---
const loading = ref(false)
const reports = ref([])

const table_options = ref({
  page: 1,
  itemsPerPage: 5,
  total_pages: 0,
  total_items: 0,
  search: "",
})

// Watch for courseId changes to refetch data
watch(() => props.courseId, (newCourseId, oldCourseId) => {
  if (newCourseId !== oldCourseId && newCourseId) {
    refetch()
  }
})

const refetch = async () => {
  loading.value = true
  try {
    const params = {
      ...(props.role ? { role: props.role } : {}),
      ...(props.classGroupId ? { class_group_id: props.classGroupId } : {}),
      ...(props.courseId ? { course_id: props.courseId } : {}),
      search: table_options.value.search,
      page: table_options.value.page,
      page_size: table_options.value.itemsPerPage,
    }

    console.log('params', params, table_options.value)
    

    const { data: result } = await axiosInstance({
      url: `/user`,
      method: "GET",
      params,
    })

    reports.value = result.data
    table_options.value.page = result.pagination.page
    table_options.value.itemsPerPage = result.pagination.page_size
    table_options.value.total_pages = result.pagination.total_pages
    table_options.value.total_items = result.pagination.total_items
  } catch (error) {
    console.error(error)
    toast.error(error.response?.data?.message || 'Failed to fetch data')
  } finally {
    loading.value = false
  }
}

onMounted(() => refetch())

const headers = ref(
  [
    { title: 'Pengguna', key: 'first_name' },
    { title: 'E-mel', key: 'email' },
    { title: 'Peranan', key: 'role' },
    { title: 'Tindakan', align: 'end', key: 'actions', sortable: false },
  ].filter(h => {
    // eslint-disable-next-line sonarjs/prefer-single-boolean-return
    if (props.hideActions && (h.key == 'actions' || h.key == 'role')) return false
    
    return true
  }),
)

const drawerForm = ref(false)

const handleDrawerForm = value => {
  if (value) {
    store.dispatch('user/fetchBeforeForm')
    if(props.role) store.commit('user/SET_FORM', { key: 'role', value: props.role })
  }
  drawerForm.value = value
}

const handleUpdate = async id => {
  await store.dispatch('user/setFormUpdate', id)
  handleDrawerForm(true)
}

const handleDelete = async id => {
  const confirm = await SwalDelete()
  if (confirm) {
    const success = await store.dispatch("user/delete", id)
    if (success) {
      refetch()
    }
  }
}
</script>
