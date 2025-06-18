<template>
  <VNavigationDrawer
    temporary
    location="end"
    :width="400"
    :model-value="open"
    @update:model-value="handleClose"
  >
    <VCard>
      <VCardItem>
        <VCardTitle>
          {{ isEditMode ? 'Edit' : 'Add' }} Class
        </VCardTitle>
        <template #append>
          <VBtn
            variant="text"
            color="default"
            icon="tabler-x"
            @click="handleClose"
          />
        </template>
      </VCardItem>

      <VDivider />

      <VCardText>
        <VForm
          ref="formRef"
          @submit.prevent="onSubmit"
        >
          <VRow>
            <!-- Class Name -->
            <VCol cols="12">
              <VTextField
                v-model="name"
                label="Class Name"
                :rules="[v => !!v || 'Class name is required']"
                density="compact"
                variant="outlined"
                placeholder="e.g. Grade 10 Science"
              />
            </VCol>
            
            <!-- Homeroom Teacher -->
            <VCol cols="12">
              <VSelect
                v-model="homeroomId"
                label="Homeroom Teacher"
                :items="teachers"
                item-title="name"
                item-value="id"
                :rules="[v => !!v || 'Homeroom teacher is required']"
                density="compact"
                variant="outlined"
                :loading="loadingTeachers"
              />
            </VCol>
          </VRow>

          <VCardActions class="pt-6">
            <VSpacer />
            <VBtn
              variant="tonal"
              color="secondary"
              @click="handleClose"
            >
              Cancel
            </VBtn>
            <VBtn
              type="submit"
              :loading="loading"
            >
              {{ isEditMode ? 'Update' : 'Save' }}
            </VBtn>
          </VCardActions>
        </VForm>
      </VCardText>
    </VCard>
  </VNavigationDrawer>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['handle-close'])

const store = useVuex()
const formRef = ref(null)

const loading = computed(() => store.state.class.loading.form)
const loadingTeachers = computed(() => store.state.class.loading.form)
const isEditMode = computed(() => Boolean(store.state.class.is_update))
const teachers = computed(() => store.state.class.teachers)

// Form fields using computed with getters and setters
const name = computed({
  get: () => store.state.class.form.name,
  set: value => store.commit('class/SET_FORM', { key: 'name', value })
})

const homeroomId = computed({
  get: () => store.state.class.form.homeroomId,
  set: value => store.commit('class/SET_FORM', { key: 'homeroomId', value })
})

// Handle close
const handleClose = () => {
  store.commit('class/SET_IS_UPDATE', false)
  store.commit('class/RESET_FORM')
  emit('handle-close', false)
}

// Initialize form when drawer opens
watch(() => props.open, (newVal) => {
  if (newVal) {
    store.dispatch('class/fetchBeforeForm')
  }
}, { immediate: true })

// Submit form
const onSubmit = async () => {
  const { valid } = await formRef.value.validate()
  
  if (!valid) return
  
  try {
    if (isEditMode.value) {
      await store.dispatch('class/update', store.state.class.is_update).then(res => {
        if (res) handleClose()
      })
    } else {
      await store.dispatch('class/create').then(res => {
        if (res) handleClose()
      })
    }
  } catch (error) {
    console.error('Form submission error:', error)
  }
}
</script>
