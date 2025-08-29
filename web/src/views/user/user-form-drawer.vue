<template>
  <VNavigationDrawer
    temporary
    location="end"
    :width="600" 
    :model-value="open"
    @update:model-value="handleClose"
  >
    <VCard class="h-100">
      <!-- Header -->
      <VCardItem class="pb-2">
        <VCardTitle class="text-h5">
          <VIcon 
            :icon="isEditMode ? 'tabler-edit' : 'tabler-user-plus'" 
            class="me-2"
            color="primary"
          />
          {{ isEditMode ? 'Edit Pengguna' : 'Tambah Pengguna Baru' }}
        </VCardTitle>
        <VCardSubtitle class="text-medium-emphasis">
          {{ isEditMode ? 'Perbarui informasi pengguna' : 'Buat akun pengguna baru dalam sistem' }}
        </VCardSubtitle>
        <template #append>
          <VBtn
            variant="text"
            color="default"
            icon="tabler-x"
            size="small"
            @click="handleClose"
          />
        </template>
      </VCardItem>

      <VDivider />

      <!-- Form Content -->
      <VCardText class="overflow-auto pb-0">
        <VForm
          ref="formRef"
          @submit.prevent="onSubmit"
        >
          <!-- Progress Indicator -->
          <div class="mb-6">
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="text-caption text-medium-emphasis">
                Langkah {{ currentStep }} dari {{ totalSteps }}
              </span>
              <VChip
                :color="showProfileFields ? 'primary' : 'secondary'"
                size="small"
                variant="tonal"
              >
                {{ showProfileFields ? 'Data Lengkap' : 'Data Dasar' }}
              </VChip>
            </div>
            <VProgressLinear
              :model-value="(currentStep / totalSteps) * 100"
              color="primary"
              height="4"
              rounded
            />
          </div>

          <!-- Step 1: Basic Information -->
          <VExpandTransition>
            <div v-show="currentStep === 1">
              <div class="mb-4">
                <div class="d-flex align-center mb-3">
                  <VIcon 
                    icon="tabler-user-circle" 
                    color="primary" 
                    class="me-2"
                  />
                  <h3 class="text-h6">
                    Informasi Dasar
                  </h3>
                </div>
                <p class="text-body-2 text-medium-emphasis mb-4">
                  Masukkan informasi dasar pengguna seperti nama, email, dan peran.
                </p>
              </div>

              <VRow>
                <!-- Name -->
                <VCol cols="12">
                  <VTextField
                    v-model="name"
                    label="Nama Lengkap *"
                    placeholder="Masukkan nama lengkap"
                    :rules="[v => !!v || 'Nama wajib diisi']"
                    prepend-inner-icon="tabler-user"
                    variant="outlined"
                    color="primary"
                  />
                </VCol>
                
                <!-- Email -->
                <VCol cols="12">
                  <VTextField
                    v-model="email"
                    label="Alamat Email *"
                    placeholder="contoh@email.com"
                    type="email"
                    :rules="[
                      v => !!v || 'Email wajib diisi',
                      v => /.+@.+\..+/.test(v) || 'Format email tidak valid'
                    ]"
                    prepend-inner-icon="tabler-mail"
                    variant="outlined"
                    color="primary"
                  />
                </VCol>

                <!-- Password (only for new users) -->
                <VCol
                  v-if="!isEditMode"
                  cols="12"
                >
                  <VTextField
                    v-model="password"
                    label="Kata Sandi *"
                    placeholder="Minimal 8 karakter"
                    :type="showPassword ? 'text' : 'password'"
                    :rules="[
                      v => !!v || 'Kata sandi wajib diisi',
                      v => (v && v.length >= 8) || 'Kata sandi minimal 8 karakter'
                    ]"
                    prepend-inner-icon="tabler-lock"
                    :append-inner-icon="showPassword ? 'tabler-eye-off' : 'tabler-eye'"
                    variant="outlined"
                    color="primary"
                    @click:append-inner="showPassword = !showPassword"
                  />
                </VCol>

                <!-- Role -->
                <VCol cols="12">
                  <VSelect
                    v-model="role"
                    label="Peran Pengguna *"
                    :items="roleOptionsTranslated"
                    :rules="[v => !!v || 'Peran wajib dipilih']"
                    prepend-inner-icon="tabler-shield-check"
                    variant="outlined"
                    color="primary"
                  />
                  <div class="mt-2">
                    <VAlert
                      v-if="role"
                      density="compact"
                      type="info"
                      variant="tonal"
                      :text="getRoleDescription(role)"
                    />
                  </div>
                </VCol>
              </VRow>
            </div>
          </VExpandTransition>

          <!-- Step 2: Profile Information -->
          <VExpandTransition>
            <div v-show="currentStep === 2 && showProfileFields">
              <div class="mb-4">
                <div class="d-flex align-center mb-3">
                  <VIcon 
                    :icon="role === 'STUDENT' ? 'tabler-school' : 'tabler-chalkboard-teacher'" 
                    color="primary" 
                    class="me-2"
                  />
                  <h3 class="text-h6">
                    Profil {{ getRoleLabel(role) }}
                  </h3>
                </div>
                <VAlert
                  density="compact"
                  type="success"
                  variant="tonal"
                  class="mb-4"
                  icon="tabler-info-circle"
                >
                  Profil {{ getRoleLabel(role) }} akan dibuat secara otomatis dengan informasi ini.
                </VAlert>
              </div>

              <VRow>
                <!-- Personal Information Section -->
                <VCol cols="12">
                  <VDivider />
                  <div class="text-subtitle-2 font-weight-medium my-3 text-primary">
                    <VIcon
                      icon="tabler-user"
                      class="me-2"
                      size="20"
                    />
                    Data Pribadi
                  </div>
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <VTextField
                    v-model="profileData.birthPlace"
                    label="Tempat Lahir"
                    placeholder="Kota tempat lahir"
                    prepend-inner-icon="tabler-map-pin"
                    variant="outlined"
                    color="primary"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <VTextField
                    v-model="profileData.birthDate"
                    label="Tanggal Lahir"
                    type="date"
                    prepend-inner-icon="tabler-calendar"
                    variant="outlined"
                    color="primary"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <VSelect
                    v-model="profileData.gender"
                    label="Jenis Kelamin"
                    :items="genderOptions"
                    prepend-inner-icon="tabler-gender-bigender"
                    variant="outlined"
                    color="primary"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <VTextField
                    v-model="profileData.phone"
                    label="Nomor Telepon"
                    placeholder="08xxxxxxxxxx"
                    prepend-inner-icon="tabler-phone"
                    variant="outlined"
                    color="primary"
                  />
                </VCol>

                <VCol cols="12">
                  <VTextarea
                    v-model="profileData.address"
                    label="Alamat Lengkap"
                    placeholder="Masukkan alamat lengkap"
                    auto-grow
                    rows="3"
                    prepend-inner-icon="tabler-home"
                    variant="outlined"
                    color="primary"
                  />
                </VCol>

                <!-- Role-specific fields -->
                <VCol cols="12">
                  <VDivider />
                  <div class="text-subtitle-2 font-weight-medium my-3 text-primary">
                    <VIcon 
                      :icon="role === 'STUDENT' ? 'tabler-school' : 'tabler-chalkboard-teacher'" 
                      class="me-2" 
                      size="20" 
                    />
                    Data {{ getRoleLabel(role) }}
                  </div>
                </VCol>

                <!-- Student-specific fields -->
                <template v-if="role === 'STUDENT'">
                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="profileData.number"
                      label="NIS (Nomor Induk Siswa)"
                      placeholder="Masukkan NIS"
                      prepend-inner-icon="tabler-id"
                      variant="outlined"
                      color="primary"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="profileData.fatherName"
                      label="Nama Ayah"
                      placeholder="Nama lengkap ayah"
                      prepend-inner-icon="tabler-user"
                      variant="outlined"
                      color="primary"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="profileData.motherName"
                      label="Nama Ibu"
                      placeholder="Nama lengkap ibu"
                      prepend-inner-icon="tabler-user"
                      variant="outlined"
                      color="primary"
                    />
                  </VCol>
                </template>

                <!-- Teacher-specific fields -->
                <template v-else-if="role === 'TEACHER'">
                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="profileData.number"
                      label="NIP (Nomor Induk Pegawai)"
                      placeholder="Masukkan NIP"
                      prepend-inner-icon="tabler-id"
                      variant="outlined"
                      color="primary"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VSelect
                      v-model="profileData.religion"
                      label="Agama"
                      :items="religionOptionsTranslated"
                      prepend-inner-icon="tabler-pray"
                      variant="outlined"
                      color="primary"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="profileData.titlePrefix"
                      label="Gelar Depan"
                      placeholder="Dr., Prof., dll."
                      prepend-inner-icon="tabler-award"
                      variant="outlined"
                      color="primary"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="profileData.titleSuffix"
                      label="Gelar Belakang"
                      placeholder="S.Pd., M.Pd., Ph.D., dll."
                      prepend-inner-icon="tabler-award"
                      variant="outlined"
                      color="primary"
                    />
                  </VCol>

                  <VCol cols="12">
                    <VTextField
                      v-model="profileData.unit"
                      label="Unit/Bagian"
                      placeholder="Departemen atau unit kerja"
                      prepend-inner-icon="tabler-building"
                      variant="outlined"
                      color="primary"
                    />
                  </VCol>
                </template>
              </VRow>
            </div>
          </VExpandTransition>
        </VForm>
      </VCardText>

      <!-- Footer Actions -->
      <VCardActions class="pa-4 mt-10">
        <div class="d-flex justify-space-between align-center w-100">
          <VBtn
            v-if="currentStep > 1"
            variant="outlined"
            color="secondary"
            prepend-icon="tabler-arrow-left"
            @click="previousStep"
          >
            Kembali
          </VBtn>
          <div v-else />

          <div class="d-flex gap-2">
            <VBtn
              variant="outlined"
              color="secondary"
              @click="handleClose"
            >
              Batal
            </VBtn>
            
            <VBtn
              v-if="currentStep < totalSteps && showProfileFields"
              color="primary"
              append-icon="tabler-arrow-right"
              @click="nextStep"
            >
              Lanjut
            </VBtn>
            
            <VBtn
              v-else
              type="submit"
              color="primary"
              :loading="loading"
              prepend-icon="tabler-check"
              @click="onSubmit"
            >
              {{ isEditMode ? 'Perbarui' : 'Simpan' }}
            </VBtn>
          </div>
        </div>
      </VCardActions>
    </VCard>
  </VNavigationDrawer>
</template>

<script setup>
import { useVuex } from "@/utils/vuex"
import { computed, ref, watch } from 'vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['handleClose'])

const store = useVuex()
const formRef = ref(null)
const showPassword = ref(false)
const currentStep = ref(1)

const loading = computed(() => store.state.user.loading.form)
const isEditMode = computed(() => Boolean(store.state.user.is_update))

// Steps calculation
const totalSteps = computed(() => showProfileFields.value ? 2 : 1)

// Role options with Indonesian translation
const roleOptionsTranslated = ref([
  { title: 'Administrator', value: 'ADMIN' },
  { title: 'Guru', value: 'TEACHER' },
  { title: 'Siswa', value: 'STUDENT' },
])

// Gender options
const genderOptions = ref([
  { title: 'Laki-laki', value: 'MALE' },
  { title: 'Perempuan', value: 'FEMALE' },
])

// Religion options with Indonesian translation
const religionOptionsTranslated = ref([
  { title: 'Islam', value: 'ISLAM' },
  { title: 'Kristen Protestan', value: 'CHRISTIAN' },
  { title: 'Katolik', value: 'CATHOLIC' },
  { title: 'Hindu', value: 'HINDU' },
  { title: 'Buddha', value: 'BUDDHA' },
  { title: 'Konghucu', value: 'KONGHUCU' },
  { title: 'Lainnya', value: 'OTHER' },
])

// Helper functions
const getRoleLabel = roleValue => {
  const roleMap = {
    'ADMIN': 'Administrator',
    'TEACHER': 'Guru', 
    'STUDENT': 'Siswa',
  }
  
  return roleMap[roleValue] || roleValue
}

const getRoleDescription = roleValue => {
  const descriptions = {
    'ADMIN': 'Administrator memiliki akses penuh ke sistem dan dapat mengelola semua data.',
    'TEACHER': 'Guru dapat mengelola kelas, siswa, dan materi pembelajaran.',
    'STUDENT': 'Siswa dapat mengakses materi pembelajaran dan mengerjakan tugas.',
  }
  
  return descriptions[roleValue] || ''
}

// Step navigation
const nextStep = () => {
  if (currentStep.value < totalSteps.value) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// Form fields using computed with getters and setters
const name = computed({
  get: () => store.state.user.form.name,
  set: value => store.commit('user/SET_FORM', { key: 'name', value }),
})

const email = computed({
  get: () => store.state.user.form.email,
  set: value => store.commit('user/SET_FORM', { key: 'email', value }),
})

const password = computed({
  get: () => store.state.user.form.password,
  set: value => store.commit('user/SET_FORM', { key: 'password', value }),
})

const role = computed({
  get: () => store.state.user.form.role,
  set: value => {
    store.commit('user/SET_FORM', { key: 'role', value })
    
    // Reset to step 1 when role changes
    currentStep.value = 1
    
    // Reset profile data when role changes
    if (value === 'ADMIN') {
      resetProfileData()
    }
  },
})

// Show profile fields for STUDENT or TEACHER
const showProfileFields = computed(() => 
  role.value === 'STUDENT' || role.value === 'TEACHER',
)

// Profile data
const profileData = ref({
  birthPlace: '',
  birthDate: null,
  gender: null,
  address: '',
  phone: '',
  number: '',
  profilePicture: null,
  fatherName: '',
  motherName: '',
  titlePrefix: '',
  titleSuffix: '',
  religion: null,
  unit: '',
})

// Reset profile data
const resetProfileData = () => {
  profileData.value = {
    birthPlace: '',
    birthDate: null,
    gender: null,
    address: '',
    phone: '',
    number: '',
    profilePicture: null,
    fatherName: '',
    motherName: '',
    titlePrefix: '',
    titleSuffix: '',
    religion: null,
    unit: '',
  }
}

// Handle close
const handleClose = () => {
  store.commit('user/SET_IS_UPDATE', false)
  store.commit('user/RESET_FORM')
  resetProfileData()
  currentStep.value = 1
  emit('handleClose', false)
}

// Initialize form when drawer opens
watch(() => props.open, newVal => {
  if (newVal) {
    store.dispatch('user/fetchBeforeForm')
    resetProfileData()
    currentStep.value = 1
    
    if (isEditMode.value) {
      loadUserProfileData()
    }
  }
}, { immediate: true })

// Load user profile data when editing
const loadUserProfileData = async () => {
  const userId = store.state.user.is_update
  if (!userId) return
  
  try {
    const result = await store.dispatch('user/getReport', userId)
    const user = store.state.user.report
    
    if (user.role === 'STUDENT' && user.studentProfile) {
      const profile = user.studentProfile

      profileData.value = {
        birthPlace: profile.birthPlace || '',
        birthDate: profile.birthDate ? profile.birthDate.split('T')[0] : null,
        gender: profile.gender || null,
        address: profile.address || '',
        phone: profile.phone || '',
        number: profile.number || '',
        fatherName: profile.fatherName || '',
        motherName: profile.motherName || '',
        titlePrefix: '',
        titleSuffix: '',
        religion: null,
        unit: '',
      }
      
      if (profile.profilePicture) {
        profileData.value.profilePicture = profile.profilePicture
      }
    } 
    else if (user.role === 'TEACHER' && user.teacherProfile) {
      const profile = user.teacherProfile

      profileData.value = {
        birthPlace: profile.birthPlace || '',
        birthDate: profile.birthDate ? profile.birthDate.split('T')[0] : null,
        gender: profile.gender || null,
        address: profile.address || '',
        phone: profile.phone || '',
        number: profile.number || '',
        titlePrefix: profile.titlePrefix || '',
        titleSuffix: profile.titleSuffix || '',
        religion: profile.religion || null,
        unit: profile.unit || '',
        fatherName: '',
        motherName: '',
      }
      
      if (profile.profilePicture) {
        profileData.value.profilePicture = profile.profilePicture
      }
    }
  } catch (error) {
    console.error('Failed to load user profile data:', error)
  }
}

// Submit form
const onSubmit = async () => {
  const { valid } = await formRef.value.validate()
  
  if (!valid) return
  
  try {
    const payload = {
      name: name.value,
      email: email.value,
      role: role.value,
    }
    
    if (!isEditMode.value) {
      payload.password = password.value
    }
    
    if (showProfileFields.value) {
      payload.profileData = { 
        ...profileData.value, 
        birthDate: profileData.value.birthDate ? new Date(profileData.value.birthDate).toISOString() : null,
      }
    }
    
    if (isEditMode.value) {
      await store.dispatch('user/update', { 
        id: store.state.user.is_update,
        data: payload,
      }).then(res => {
        if (res) handleClose()
      })
    } else {
      await store.dispatch('user/create', payload).then(res => {
        if (res) handleClose()
      })
    }
  } catch (error) {
    console.error('Form submission error:', error)
  }
}
</script>
