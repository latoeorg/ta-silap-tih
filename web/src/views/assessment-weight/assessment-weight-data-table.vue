<template>
  <VCard>
    <VCardTitle class="d-flex justify-space-between align-center">
      <span>Kelola Bobot Penilaian</span>
      <VBtn
        variant="text"
        icon="tabler-x"
        @click="closeDialog"
      />
    </VCardTitle>

    <VDivider />

    <VCardText style="max-block-size: 70vh; overflow-y: auto;">
      <div
        v-if="loading"
        class="d-flex justify-center py-8"
      >
        <VProgressCircular indeterminate />
      </div>
      <div v-else>
        <VForm
          ref="formRef"
          @submit.prevent="saveWeights"
        >
          <p class="text-caption text-medium-emphasis mb-4">
            Tentukan bobot dan kuota untuk setiap jenis penilaian pada mata pelajaran ini. Total bobot harus sama dengan 100%.
          </p>

          <VCard
            variant="outlined"
            class="mb-4"
          >
            <VTable
              fixed-header
              density="comfortable"
              class="assessment-weights-table"
            >
              <thead>
                <tr>
                  <th class="text-left">
                    JENIS PENILAIAN
                  </th>
                  <th
                    width="20%"
                    class="text-left"
                  >
                    BOBOT (%)
                  </th>
                  <th
                    width="20%"
                    class="text-left"
                  >
                    KUOTA
                  </th>
                  <th
                    width="15%"
                    class="text-center"
                  >
                    AKSI
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!assessmentWeights.length">
                  <td
                    colspan="4"
                    class="text-center py-4"
                  >
                    Belum ada bobot penilaian yang ditentukan.
                  </td>
                </tr>
                <tr
                  v-for="item in assessmentWeights"
                  :key="item.id"
                >
                  <td>
                    <VChip
                      label
                      size="small"
                      variant="tonal"
                    >
                      {{ item.examType.replace(/_/g, ' ') }}
                    </VChip>
                  </td>
                  <td>
                    <VTextField
                      v-model.number="item.weight"
                      type="number"
                      density="compact"
                      variant="outlined"
                      hide-details="auto"
                      placeholder="Contoh: 20"
                      :rules="[v => v === null || v >= 0 || 'Tidak boleh negatif']"
                      suffix="%"
                    />
                  </td>
                  <td>
                    <VTextField
                      v-model.number="item.quota"
                      type="number"
                      density="compact"
                      variant="outlined"
                      hide-details="auto"
                      placeholder="Contoh: 2"
                      :rules="[
                        v => v !== null || 'Kuota wajib diisi',
                        v => v > 0 || 'Harus bernilai positif',
                      ]"
                    />
                  </td>
                  <td class="text-center">
                    <VBtn
                      icon="tabler-trash"
                      size="small"
                      variant="text"
                      color="error"
                      @click="removeWeight(item)"
                    />
                  </td>
                </tr>
              </tbody>
            </VTable>
          </VCard>
          <VDivider class="my-4" />
          <div class="add-new-assessment">
            <p class="text-subtitle-2 mb-2">
              Tambah Jenis Penilaian Baru
            </p>
            <VRow align="end">
              <VCol
                cols="12"
                md="5"
              >
                <VSelect
                  v-model="newAssessment.examType"
                  label="Jenis Penilaian"
                  placeholder="Contoh: PROYEK AKHIR"
                  density="compact"
                  variant="outlined"
                  :items="EXAM_TYPE_OPTIONS"
                  item-title="label"
                  item-value="value"
                />
              </VCol>
              <VCol
                cols="12"
                md="2"
              >
                <VTextField
                  v-model.number="newAssessment.weight"
                  label="Bobot (%)"
                  type="number"
                  density="compact"
                  variant="outlined"
                  hide-details="auto"
                  placeholder="Contoh: 30"
                />
              </VCol>
              <VCol
                cols="12"
                md="2"
              >
                <VTextField
                  v-model.number="newAssessment.quota"
                  label="Kuota"
                  type="number"
                  density="compact"
                  variant="outlined"
                  hide-details="auto"
                  placeholder="Contoh: 1"
                />
              </VCol>
              <VCol
                cols="12"
                md="3"
              >
                <VBtn
                  block
                  variant="tonal"
                  @click="addWeight"
                >
                  <VIcon
                    start
                    icon="tabler-plus"
                  />
                  Tambah
                </VBtn>
              </VCol>
            </VRow>
          </div>
          <VDivider class="my-6" />

          <div
            v-if="assessmentWeights.length"
            class="weight-distribution"
          >
            <div class="d-flex align-center mb-2">
              <div class="text-subtitle-2 me-2">
                Distribusi Total Bobot:
              </div>
              <div
                class="ms-2 font-weight-bold"
                :class="getWeightTotalClass()"
              >
                {{ totalWeight }} / 100%
              </div>
            </div>

            <VProgressLinear
              :model-value="totalWeight > 100 ? 100 : totalWeight"
              height="14"
              rounded
              :color="totalWeight > 100 ? 'error' : (totalWeight === 100 ? 'success' : 'warning')"
            />
            
            <VAlert
              v-if="totalWeight > 100"
              color="error"
              variant="tonal"
              class="mt-4"
              density="compact"
            >
              <div class="d-flex align-center">
                <VIcon
                  class="me-2"
                  icon="tabler-alert-circle"
                />
                <span>Total bobot tidak boleh lebih dari 100%.</span>
              </div>
            </VAlert>
          </div>
        </VForm>
      </div>
    </VCardText>

    <VDivider />

    <VCardActions class="pa-4">
      <VSpacer />
      <VBtn
        variant="outlined"
        color="secondary"
        @click="closeDialog"
      >
        Batal
      </VBtn>
      <VBtn
        color="primary"
        variant="elevated"
        :loading="isSaving"
        :disabled="totalWeight !== 100"
        @click="saveWeights"
      >
        Simpan Perubahan
      </VBtn>
    </VCardActions>
  </VCard>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { toast } from 'vue-sonner'
import { useStore } from 'vuex'

const props = defineProps({
  subjectId: { type: String, required: true },
  modelValue: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'save'])

const store = useStore()
const formRef = ref(null)
const isSaving = ref(false)

const EXAM_TYPE_OPTIONS = [
  { label: 'Harian', value: 'DAILY' },
  { label: 'UTS (Mid Term)', value: 'MID_TERM' },
  { label: 'UAS (Final)', value: 'FINAL' },
  { label: 'Kuis', value: 'QUIZ' },
  { label: 'Tugas', value: 'ASSIGNMENT' },
]

const newAssessment = reactive({
  examType: '',
  weight: null,
  quota: null,
})

const loading = computed(() => store.state.assessmentWeight.loading.reports)
const assessmentWeights = computed(() => store.state.assessmentWeight.reports)

const totalWeight = computed(() => {
  return assessmentWeights.value.reduce((sum, item) => sum + (Number(item.weight) || 0), 0)
})

const getWeightTotalClass = () => {
  if (totalWeight.value > 100) return 'text-error'
  if (totalWeight.value === 100) return 'text-success'
  
  return 'text-warning'
}

const closeDialog = () => {
  emit('update:modelValue', false)
}

const refetch = () => {
  store.dispatch('assessmentWeight/getReports', {
    subjectId: props.subjectId,
  })
}

const addWeight = async () => {
  if (!newAssessment.examType || newAssessment.weight === null || newAssessment.quota === null) {
    toast.error('Harap isi semua kolom untuk penilaian baru.')
    
    return
  }
  if (newAssessment.weight < 0 || newAssessment.quota <= 0) {
    toast.error('Bobot tidak boleh negatif dan kuota harus positif.')
    
    return
  }

  const formattedExamType = newAssessment.examType.trim().toUpperCase().replace(/\s+/g, '_')
  const isDuplicate = assessmentWeights.value.some(w => w.examType === formattedExamType)

  if (isDuplicate) {
    toast.error(`Jenis penilaian "${formattedExamType.replace(/_/g, ' ')}" sudah ada.`)
    
    return
  }

  const payload = {
    subjectId: props.subjectId,
    examType: formattedExamType,
    weight: Number(newAssessment.weight),
    quota: Number(newAssessment.quota),
  }

  const success = await store.dispatch('assessmentWeight/create', payload)
  
  if (success) {
    Object.assign(newAssessment, { examType: '', weight: null, quota: null })
    refetch()
  }
}

const removeWeight = async item => {
  if (confirm(`Apakah Anda yakin ingin menghapus penilaian "${item.examType.replace(/_/g, ' ')}"?`)) {
    const success = await store.dispatch('assessmentWeight/delete', item.id)
    if (success) {
      refetch()
    }
  }
}

const saveWeights = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) {
    toast.error('Harap perbaiki kesalahan validasi sebelum menyimpan.')
    
    return
  }

  if (totalWeight.value !== 100) {
    toast.error('Total bobot harus tepat 100% untuk menyimpan perubahan.')
    
    return
  }

  isSaving.value = true
  try {
    const weightsToUpdate = assessmentWeights.value.map(item => ({
      id: item.id,
      data: {
        weight: Number(item.weight),
        quota: Number(item.quota),
      },
    }))

    const success = await store.dispatch('assessmentWeight/updateBulk', weightsToUpdate)
    if (success) {
      emit('save')
      closeDialog()
    }
  } catch (error) {
    console.error('Gagal menyimpan bobot:', error)
  } finally {
    isSaving.value = false
  }
}

onMounted(() => refetch())
</script>

<style scoped>
.assessment-weights-table th {
  background-color: rgb(var(--v-theme-on-surface), 0.04);
  font-weight: 500;
}
</style>
