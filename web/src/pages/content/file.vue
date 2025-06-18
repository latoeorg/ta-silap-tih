<template>
  <div>
    <VCard title="Files">
      <VDivider />

      <VCardText>
        <div class="d-flex align-center justify-end flex-wrap gap-4">
          <div style="inline-size: 15rem;">
            <AppSelect
              v-model="type"
              :items="type_list"
              density="compact"
              @update:model-value="refetch"
            />
          </div>
          <div style="inline-size: 20rem;">
            <AppTextField
              v-model="table_options.search"
              density="compact"
              placeholder="Search ..."
              append-inner-icon="tabler-search"
            />
          </div>

          <div>
            <VBtn
              :loading="loading_upload"
              @click="refInputEl?.click()"
            >
              Upload
              <VIcon
                end
                icon="tabler-cloud-upload"
              />
            </VBtn>

            <input
              ref="refInputEl"
              type="file"
              name="file"
              accept="image/*,video/*"
              multiple
              hidden
              @input="handleUpload"
            >
          </div>

          <!--
            <VBtn @click="handleModalContentFile(true)">
            Upload Test
            <VIcon
            end
            icon="tabler-cloud-upload"
            />
            </VBtn> 
          -->
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
          <template #item.name="{ item }">
            <div class="d-flex align-items-center gap-3">
              <div class="my-3">
                <VAvatar
                  v-if="item.type === 'ICON'"
                  :image="`${item?.filepath}`"
                  :size="60"
                  class="pa-3"
                  color="primary"
                  rounded
                />
              
                <VAvatar
                  v-else
                  :image="`${item?.filepath}`"
                  :size="80"
                  variant="tonal"
                  rounded
                />
              </div>

              <div class="">
                <h6 class="mb-0 text-h6">
                  {{ item.name.length > 50 ? item.name.substring(0, 50) + '...' : item.name }}
                </h6>

                <p class="text-body text-uppercase mb-0">
                  <small class="font-weight-medium">{{ item.extension }}</small>
                </p>
              </div>
            </div>
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex justify-end gap-3">
              <VBtn
                icon="tabler-link"
                variant="flat"
                size="small"
                rounded
                @click="handleCopy(item)"
              />
              <VBtn
                icon="tabler-trash"
                color="error"
                variant="tonal"
                size="small"
                rounded
                @click="handleDelete(item)"
              />
            </div>
          </template>
        </VDataTableServer>
      </VCardText>
    </VCard>
  </div>

  <ContentFileSelect
    :is-open="open_content_file"
    multiple
    @handle-close="handleModalContentFile"
  />
</template>


<script setup>
import moment from 'moment'

import { toast } from 'vue-sonner'


const headers = ref([
  { title: 'File Name',  key: 'name' },
  { title: 'Date Added',  key: 'created_at', value: val => moment(val.created_at).calendar() },
  { title: 'Size',  key: 'size', value: val => formatFileSize(val.size) },
  { title: 'Actions',  key: 'actions', align: 'end', sortable: false },
])

const refInputEl = ref()
const open_content_file = ref(false)

const handleModalContentFile = value => {
  open_content_file.value = value
}

const store = useVuex()
const refetch = () => store.dispatch('content/file/GetReports')

onMounted(() =>refetch())

const table_options = computed({
  get: () => store.state.content.file.table_options,
  set: value => store.commit('content/file/SET_OPTIONS_TABLE', value),
})

const type = computed({
  get: () => store.state.content.file.type,
  set: value => store.commit('content/file/SET_TYPE', value),
})

const loading = computed(() => store.state.content.file.loading.reports)
const loading_upload = computed(() => store.state.content.file.loading.form)
const type_list = computed(() => store.state.content.file.type_list)
const reports = computed(() => store.state.content.file.reports)

const handleUpload = e => {
  const files = e.target.files
  if (!files.length) return

  const formData = new FormData()

  for (let i = 0; i < files.length; i++) {
    formData.append('filepath[]', files[i])
  }

  store.dispatch('content/file/BulkUpload', formData)

  e.target.value = null
}

const handleCopy = async item => {
  try {
    await navigator.clipboard.writeText(item.filepath)
    toast.success('Link copied to clipboard')
  } catch (error) {
    toast.error('Failed to copy link')
  }
}

const handleDelete = async item => {
  const isConfirmed = await SwalDelete()

  if (isConfirmed) {
    store.dispatch('content/file/Delete', item.id)
  }
}
</script>
