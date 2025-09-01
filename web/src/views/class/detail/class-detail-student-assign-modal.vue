<template>
  <VDialog
    v-model="dialogModel"
    max-width="1000px"
    persistent
  >
    <VCard>
      <VCardTitle class="d-flex justify-space-between align-center">
        <span>Kelola Siswa</span>
        <VBtn
          variant="text"
          icon="tabler-x"
          @click="closeDialog"
        />
      </VCardTitle>

      <VDivider />

      <UserDataTable
        v-model:model-value="selected"
        title=""
        show-select
        hide-add-button
        hide-actions
      />

      <VDivider />

      <VCardActions class="py-3 gap-4">
        <VSpacer />
        <!-- cancel button -->
        <VBtn
          variant="ghost"
          @click="closeDialog"
        >
          <VIcon
            icon="tabler-x"
            start
          />
          Batal
        </VBtn>

        <VBtn
          :loading="isLoading"
          variant="flat"
          @click="handleSave"
        >
          <VIcon
            icon="tabler-check"
            start
          />
          Simpan
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup>
import UserDataTable from '@/views/user/user-data-table.vue'
import { computed, ref, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  classGroupId: { type: String, default: '' },
})

const emit = defineEmits(['update:open', 'refresh'])

// 👇 2. ADDED LOCAL STATE FOR LOADING AND SELECTION
const isLoading = ref(false)
const selected = ref([])
const store = useVuex()

// 👇 3. ADDED WATCHER TO SYNC PROPS TO LOCAL STATE WHEN DIALOG OPENS
watch(() => props.open, isOpen => {
  if (isOpen && props.classGroupId) {
    store.dispatch('classGroup/getStudentIds', props.classGroupId)
      .then(studentIds => {
        selected.value = studentIds

        console.log('studentIds', studentIds)
        
      })
  }
})

// Dialog state
const dialogModel = computed({
  get: () => props.open,
  set: value => emit('update:open', value),
})

const closeDialog = () => {
  emit('update:open', false)
}

// 👇 4. ADDED THE SAVE HANDLER
const handleSave = async () => {
  isLoading.value = true
  try {
    const success = await store.dispatch('classGroup/updateStudents', {
      classGroupId: props.classGroupId,
      studentIds: selected.value,
    })

    if (success) {
      // If the API call is successful, emit refresh to the parent and close the dialog
      emit('refresh')
      store.dispatch('classGroup/getReport', props.classGroupId)
      closeDialog()
    }
  } catch (error) {
    // Error is already handled by toast in the Vuex action
    console.error("Failed to save students:", error)
  } finally {
    isLoading.value = false
  }
}
</script>
