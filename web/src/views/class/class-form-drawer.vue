<template>
  <VNavigationDrawer
    v-model="dialog"
    temporary
    location="end"
    width="400"
    class="class-group-drawer"
  >
    <VSheet class="drawer-header">
      <div>
        <h5 class="text-h5">
          {{ isEditing ? 'Edit Rombel' : 'Tambah Rombel' }}
        </h5>
        <p class="text-body-2 text-medium-emphasis">
          {{ isEditing ? 'Perbarui detail rombongan belajar.' : 'Buat rombongan belajar baru.' }}
        </p>
      </div>
      <VBtn
        icon="tabler-x"
        variant="text"
        size="small"
        @click="closeDrawer"
      />
    </VSheet>

    <VDivider />

    <VCardText>
      <VForm
        ref="formRef"
        @submit.prevent="handleSubmit"
      >
        <VRow>
          <VCol cols="12">
            <VTextField
              v-model="form.name"
              label="Nama Rombel"
              placeholder="Contoh: Kelas 10 IPA 1"
              :rules="[v => !!v || 'Nama Rombel wajib diisi']"
              variant="outlined"
            />
          </VCol>

          <VCol cols="12">
            <VSelect
              v-model="form.homeroomId"
              :items="listTeacher"
              item-title="name"
              item-value="id"
              label="Wali Kelas"
              placeholder="Pilih Wali Kelas"
              :rules="[v => !!v || 'Wali Kelas wajib dipilih']"
              :loading="isListTeacherLoading"
              variant="outlined"
              clearable
            >
              <template #no-data>
                <div class="pa-2 text-center">
                  Data guru tidak ditemukan.
                </div>
              </template>
            </VSelect>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>

    <VSpacer />

    <div class="drawer-actions">
      <VBtn
        variant="outlined"
        color="secondary"
        @click="closeDrawer"
      >
        Batal
      </VBtn>
      <VBtn
        color="primary"
        :loading="loading"
        @click="handleSubmit"
      >
        Simpan
      </VBtn>
    </div>
  </VNavigationDrawer>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'

// --- Props & Emits ---
const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
  editId: {
    type: [String, null],
    default: null,
  },
})

const emit = defineEmits(['update:open', 'refresh', 'handleClose'])

// --- Store ---
const store = useStore()


// Mengakses state dan loading dari store
const form = computed(() => store.state.classGroup.form)
const loading = computed(() => store.state.classGroup.loading.form)
const listTeacher = computed(() => store.state.classGroup.list_teacher)
const isListTeacherLoading = computed(() => store.state.classGroup.loading.form) // Asumsi loading guru sama dengan loading form

// --- Refs ---
const formRef = ref(null)

// --- Dialog Control ---
// Computed property untuk sinkronisasi v-model
const dialog = computed({
  get: () => props.open,
  set: val => emit('update:open', val),
})

const closeDrawer = () => {
  store.commit('classGroup/RESET_FORM')
  emit('handleClose')
  dialog.value = false
}

watch(() => props.open, async isOpen => {
  if (isOpen) {
    await store.dispatch('classGroup/fetchBeforeForm')

    if (props.isEditing && props.editId) {
      await store.dispatch('classGroup/setFormUpdate', props.editId)
    }
  } else {
    store.commit('classGroup/RESET_FORM')
  }
})

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  let success = false
  if (props.isEditing) {
    success = await store.dispatch('classGroup/update')
  } else {
    success = await store.dispatch('classGroup/create')
  }

  if (success === true) {
    emit('refresh')
    closeDrawer()
  }
}
</script>

<style scoped>
.class-group-drawer {
  display: flex;
  flex-direction: column;
}

.drawer-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.5rem;
}

.drawer-actions {
  display: flex;
  justify-content: flex-end;
  padding: 1.5rem;
  background-color: rgb(var(--v-theme-surface));
  gap: 0.75rem;
}
</style>
