<template>
  <span
    class="d-block"
    @click="handleOpen"
  >
    <slot />
  </span>

  <VDialog
    :model-value="openDialog"
    max-width="1200"
    max-height="800"
    persistent
  >
    <DialogCloseBtn
      title="Image"
      @click="handleClose"
    />
  
    <VCard>
      <VCardTitle class="border-b">
        Image
      </VCardTitle>

      <!-- shadow bottom -->
      <VCardItem
        class="border-b pb-3"
        style="box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);"
      >
        <div style="inline-size: 20rem;">
          <AppTextField
            v-model="search"
            density="compact"
            placeholder="Search ..."
            prepend-inner-icon="tabler-search"
            clearable
            @update:model-value="onSearch"
          />
        </div>
      </VCardItem>

      <VInfiniteScroll
        :height="800"
        :items="reports"
        @load="LoadMore"
      >
        <VCardText>
          <div class="w-full h-auto relative">
            <div
              ref="dropZoneRef"
              class="cursor-pointer"
              @click="() => open()"
            >
              <div class="d-flex flex-column justify-center align-center gap-y-3 px-6 py-10 border drop-zone">
                <IconBtn
                  variant="tonal"
                  class="rounded-sm"
                >
                  <VIcon icon="tabler-upload" />
                </IconBtn>
                <div class="text-base text-high-emphasis font-weight-medium">
                  Drag and Drop Your Image Here.
                </div>
                <span class="text-disabled">or</span>

                <VBtn
                  variant="tonal"
                  size="small"
                  :loading="loading_upload"
                >
                  Browse Images
                </VBtn>
              </div>
            </div>
          </div>

          <VDivider class="my-7" />

    
          <CustomRadiosWithImage
            v-if="!multiple"
            v-model:selected-radio="selectedRadio"
            :radio-content="reports.map((report) => ({
              bgImage: report.filepath,
              value: report.filepath,
            }))"
            :grid-column="{ lg: '2', md: '3', sm: '4', cols: '12' }"
          />
          <CustomCheckboxesWithImage
            v-if="multiple"
            v-model:selected-checkbox="selectedCheckbox"
            :checkbox-content="reports.map((report) => ({
              bgImage: report.filepath,
              value: report.filepath,
            }))"
            :grid-column="{ lg: '2', md: '3', sm: '4', cols: '12' }"
          />
        </VCardText>
      </VInfiniteScroll>
      <VCardText>
        <div class="d-flex flex-row-reverse gap-3 pt-5">
          <VBtn
            size="small"
            type="submit"
            @click="handleSubmit"
          >
            Submit
          </VBtn>
          <VBtn
            size="small"
            variant="tonal"
            @click="handleClose"
          >
            Cancel
          </VBtn>
        </div>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script setup>
import { debounce } from '@/utils/utils'
import { useStore } from 'vuex'

const props = defineProps({
  multiple: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'IMAGE',
  },
  modelValue: {
    type: [String, Array],
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const openDialog = ref(false)

const handleOpen = () => openDialog.value = true
const handleClose = () =>  openDialog.value = false

const store = useStore()
const reports = ref([])
const search = ref('')
const page = ref(1)
const page_size = ref(10)
const total_pages = ref(0)
const total_items = ref(0)

const selectedRadio = ref('')
const selectedCheckbox = ref([''])

const loading_upload = computed(() => store.state.content.file.loading.form)

watch(() => openDialog.value, value => {
  if (value) {
    page.value = 1
    reports.value = []
    refetch()

    if(props.modelValue){
      if (props.multiple) {
        selectedCheckbox.value = props.modelValue
      } else {
        selectedRadio.value = props.modelValue
      }
    }
  }
})

const refetch = async () => {
  await store.dispatch('content/file/GetFileInfinityScroll', {
    page: page.value,
    page_size: page_size.value,
    search: search.value,
    type: props.type,
  }).then(res => {
    reports.value.push(...res.data)
    total_pages.value = res.pagination.total_pages
    total_items.value = res.pagination.total_items
    
    return res.pagination.page_size < res.pagination.total
  })
}

const LoadMore = async ({ done }) => {
  if (page.value < total_pages.value) {
    page.value++
    await refetch()
    done()
  } else {
    done('empty')
  }
}

const onSearch = debounce(() => {
  page.value = 1
  reports.value = []
  refetch()
}, 500)


const dropZoneRef = ref()

useDropZone(dropZoneRef, onDrop)

const images = ref([])

const { open, onChange } = useFileDialog({ accept: 'image/*' })

function onDrop(DroppedFiles) {
  DroppedFiles?.forEach(file => {
    if (file.type.slice(0, 6) !== 'image/') {
      alert('Only image files are allowed')
      
      return
    }
    images.value.push(file)
  })

  handleUpload()
}

onChange(selectedFiles => {
  if (!selectedFiles)
    return
  for (const file of selectedFiles) {
    images.value.push(file)
  }

  handleUpload()
})

const handleUpload = () => {
  const formData = new FormData()

  images.value.forEach(image => {
    formData.append('filepath[]', image)
  })

  store.dispatch('content/file/BulkUpload', formData).then(() => {
    images.value = []
    
    page.value = 1
    reports.value = []

    refetch()
  })
}

const handleSubmit = () => {
  // if(!props.modelValue) return

  if (props.multiple) {
    emit('update:modelValue', selectedCheckbox.value)
  } else {
    emit('update:modelValue', selectedRadio.value)
  }

  handleClose()
}
</script>
