<template>
  <div class="student-dashboard">
    <!-- Welcome Header -->
    <VCard
      class="welcome-header"
      color="primary"
      variant="elevated"
    >
      <VCardText>
        <div class="d-flex align-center gap-4">
          <VIcon
            icon="tabler-school"
            size="48"
            color="white"
          />
          <div>
            <h1 class="text-h4 font-weight-bold text-white mb-1">
              Selamat Datang Di Sistem Informasi dan Layanan Siswa Polibatam
            </h1>
            <p class="text-white opacity-80">
              Anda dapat menikmati layanan secara online 📱
            </p>
          </div>
        </div>
      </VCardText>
    </VCard>

    <!-- Profile Update Notice -->
    <VAlert
      type="info"
      variant="tonal"
      class="mt-4"
      closable
    >
      <template #prepend>
        <VIcon icon="tabler-info-circle" />
      </template>
      <div>
        Lengkapi profil Anda untuk mengakses semua fitur sistem. Klik 
        <VBtn
          variant="text"
          color="primary"
          size="small"
          to="/profile"
          class="mx-1"
        >
          PROFILE
        </VBtn>
        untuk melengkapi data diri.
      </div>
    </VAlert>

    <!-- Student Profile Card -->
    <VRow class="mt-6">
      <VCol
        cols="12"
        md="4"
      >
        <div class="profile-illustration text-center">
          <VAvatar
            v-if="user.studentProfile?.profilePicture"
            :image="user.studentProfile.profilePicture"
            size="200"
            class="profile-avatar"
          />
          <VIcon
            v-else
            icon="tabler-user-circle"
            size="200"
            color="primary"
            class="illustration-image opacity-60"
          />
        </div>
      </VCol>

      <VCol
        cols="12"
        md="8"
      >
        <VCard class="profile-data-card">
          <VCardTitle class="d-flex align-center justify-space-between bg-primary py-4">
            <div class="d-flex align-center">
              <VIcon
                icon="tabler-user"
                class="me-2"
                color="white"
              />
              <span class="text-white">DATA DIRI Siswa</span>
            </div>
            <VChip
              :color="getStatusColor(user.studentProfile?.status)"
              size="small"
              variant="elevated"
            >
              {{ getStatusText(user.studentProfile?.status) }}
            </VChip>
          </VCardTitle>

          <VCardText class="pa-6">
            <VRow>
              <!-- Basic Information -->
              <VCol
                cols="12"
                sm="6"
              >
                <div class="profile-field">
                  <strong>Nama</strong>
                  <p class="profile-value">
                    {{ user.name || '-' }}
                  </p>
                </div>
              </VCol>

              <VCol
                cols="12"
                sm="6"
              >
                <div class="profile-field">
                  <strong>Email</strong>
                  <p class="profile-value">
                    {{ user.email || '-' }}
                  </p>
                </div>
              </VCol>

              <VCol
                cols="12"
                sm="6"
              >
                <div class="profile-field">
                  <strong>Jenis Kelamin</strong>
                  <p class="profile-value">
                    {{ getGenderText(user.studentProfile?.gender) }}
                  </p>
                </div>
              </VCol>

              <VCol
                cols="12"
                sm="6"
              >
                <div class="profile-field">
                  <strong>Status</strong>
                  <p class="profile-value">
                    {{ getStatusText(user.studentProfile?.status) }}
                  </p>
                </div>
              </VCol>

              <VCol
                cols="12"
                sm="6"
                md="4"
              >
                <div class="profile-field incomplete">
                  <strong>NIM</strong>
                  <p class="profile-value-empty">
                    {{ user?.studentProfile?.number || 'Belum diisi' }}
                  </p>
                </div>
              </VCol>

              <VCol
                cols="12"
                sm="6"
                md="4"
              >
                <div class="profile-field incomplete">
                  <strong>No Telp/HP</strong>
                  <p class="profile-value-empty">
                    {{ user?.studentProfile?.phone || 'Belum diisi' }}
                  </p>
                </div>
              </VCol>

              <VCol
                cols="12"
                sm="6"
                md="4"
              >
                <div class="profile-field incomplete">
                  <strong>Tempat Lahir</strong>
                  <p class="profile-value-empty">
                    {{ user?.studentProfile?.birthPlace || 'Belum diisi' }}
                  </p>
                </div>
              </VCol>

              <VCol
                cols="12"
                sm="6"
                md="4"
              >
                <div class="profile-field incomplete">
                  <strong>Tanggal Lahir</strong>
                  <p class="profile-value-empty">
                    {{ user?.studentProfile?.birthDate ? formatDate(user.studentProfile.birthDate) : 'Belum diisi' }}
                  </p>
                </div>
              </VCol>

              <VCol
                cols="12"
                sm="6"
                md="4"
              >
                <div class="profile-field incomplete">
                  <strong>Nama Ayah</strong>
                  <p class="profile-value-empty">
                    {{ user?.studentProfile?.fatherName || 'Belum diisi' }}
                  </p>
                </div>
              </VCol>

              <VCol
                cols="12"
                sm="6"
                md="4"
              >
                <div class="profile-field incomplete">
                  <strong>Nama Ibu</strong>
                  <p class="profile-value-empty">
                    {{ user?.studentProfile?.motherName || 'Belum diisi' }}
                  </p>
                </div>
              </VCol>

              <VCol cols="12">
                <div class="profile-field incomplete">
                  <strong>Alamat</strong>
                  <p class="profile-value-empty">
                    {{ user?.studentProfile?.address || 'Belum diisi' }}
                  </p>
                </div>
              </VCol>
            </VRow>

            <VDivider class="my-4" />

            <div class="text-center">
              <VBtn
                color="primary"
                size="large"
                prepend-icon="tabler-edit"
                to="/profile"
                class="me-2"
              >
                Lengkapi Profil
              </VBtn>
              <VBtn
                color="secondary"
                size="large"
                prepend-icon="tabler-refresh"
                variant="outlined"
                @click="refreshProfile"
              >
                Refresh Data
              </VBtn>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Statistics Cards -->
    <VRow class="mt-6">
      <VCol
        cols="12"
        sm="6"
        md="3"
      >
        <VCard class="stat-card">
          <VCardText class="text-center pa-4">
            <VIcon
              icon="tabler-user-check"
              size="40"
              color="success"
              class="mb-2"
            />
            <div class="text-h6 font-weight-bold">
              {{ getStatusText(user.studentProfile?.status) }}
            </div>
            <div class="text-caption text-medium-emphasis">
              Status Siswa
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol
        cols="12"
        sm="6"
        md="3"
      >
        <VCard class="stat-card">
          <VCardText class="text-center pa-4">
            <VIcon
              icon="tabler-calendar"
              size="40"
              color="info"
              class="mb-2"
            />
            <div class="text-h6 font-weight-bold">
              {{ formatDate(user.createdAt) }}
            </div>
            <div class="text-caption text-medium-emphasis">
              Tanggal Bergabung
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol
        cols="12"
        sm="6"
        md="3"
      >
        <VCard class="stat-card">
          <VCardText class="text-center pa-4">
            <VIcon
              icon="tabler-clock"
              size="40"
              color="warning"
              class="mb-2"
            />
            <div class="text-h6 font-weight-bold">
              {{ formatDate(user.updatedAt) }}
            </div>
            <div class="text-caption text-medium-emphasis">
              Update Terakhir
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol
        cols="12"
        sm="6"
        md="3"
      >
        <VCard class="stat-card">
          <VCardText class="text-center pa-4">
            <VIcon
              icon="tabler-percentage"
              size="40"
              color="error"
              class="mb-2"
            />
            <div class="text-h6 font-weight-bold">
              {{ getProfileCompletionPercentage() }}%
            </div>
            <div class="text-caption text-medium-emphasis">
              Kelengkapan Profil
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Guide Section -->
    <VCard class="mt-6">
      <VCardTitle class="bg-info">
        <VIcon
          icon="tabler-book"
          class="me-2"
          color="white"
        />
        <span class="text-white">Panduan Sistem Informasi dan Layanan Siswa</span>
      </VCardTitle>

      <VCardText class="pa-6">
        <div class="guide-content">
          <p class="text-body-1 mb-4">
            Sistem ini dirancang untuk memudahkan Siswa dalam mengakses berbagai layanan akademik dan administratif. 
            Berikut adalah panduan penggunaan sistem:
          </p>

          <VRow>
            <VCol
              cols="12"
              md="6"
            >
              <div class="guide-item">
                <VIcon
                  icon="tabler-user-edit"
                  color="primary"
                  class="me-2"
                />
                <strong>Lengkapi Profil:</strong> Pastikan data diri Anda lengkap dan terkini
              </div>

              <div class="guide-item">
                <VIcon
                  icon="tabler-book-2"
                  color="primary"
                  class="me-2"
                />
                <strong>Akses Materi:</strong> Unduh materi pembelajaran dari dosen
              </div>

              <div class="guide-item">
                <VIcon
                  icon="tabler-calendar"
                  color="primary"
                  class="me-2"
                />
                <strong>Jadwal Kuliah:</strong> Lihat jadwal kuliah dan ujian Anda
              </div>
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <div class="guide-item">
                <VIcon
                  icon="tabler-chart-line"
                  color="primary"
                  class="me-2"
                />
                <strong>Nilai:</strong> Pantau nilai dan IPK Anda secara real-time
              </div>

              <div class="guide-item">
                <VIcon
                  icon="tabler-file-text"
                  color="primary"
                  class="me-2"
                />
                <strong>Dokumen:</strong> Ajukan dan unduh berbagai dokumen akademik
              </div>

              <div class="guide-item">
                <VIcon
                  icon="tabler-help-circle"
                  color="primary"
                  class="me-2"
                />
                <strong>Bantuan:</strong> Hubungi admin untuk bantuan teknis
              </div>
            </VCol>
          </VRow>
        </div>
      </VCardText>
    </VCard>
  </div>
</template>

<script setup>
const store = useVuex()

// Computed
const user = computed(() => store.state.app.user)

// Methods
const formatDate = date => {
  if (!date) return '-'
  
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

const getGenderText = gender => {
  switch (gender) {
  case 'MALE':
    return 'Laki-laki'
  case 'FEMALE':
    return 'Perempuan'
  default:
    return '-'
  }
}

const getStatusText = status => {
  switch (status) {
  case 'ACTIVE':
    return 'Aktif'
  case 'INACTIVE':
    return 'Tidak Aktif'
  case 'SUSPENDED':
    return 'Ditangguhkan'
  default:
    return '-'
  }
}

const getStatusColor = status => {
  switch (status) {
  case 'ACTIVE':
    return 'success'
  case 'INACTIVE':
    return 'error'
  case 'SUSPENDED':
    return 'warning'
  default:
    return 'grey'
  }
}

const getProfileCompletionPercentage = () => {
  if (!user.value) return 0
  
  const fields = [
    user.value.number,
    user.value.name,
    user.value.birthPlace,
    user.value.birthDate,
    user.value.fatherName,
    user.value.motherName,
    user.value.address,
    user.value.phone,
    user.value.email,
  ]
  
  const completedFields = fields.filter(field => field && field.trim() !== '').length
  
  return Math.round((completedFields / fields.length) * 100)
}

const getFullImageUrl = imagePath => {
  if (!imagePath) return ''

  // Assuming your API base URL - adjust as needed
  const baseUrl = 'http://localhost:3001' // or your actual API URL
  
  return imagePath.startsWith('http') ? imagePath : `${baseUrl}${imagePath}`
}

const refreshProfile = () => {
  // Add your profile refresh logic here
  console.log('Refreshing profile...')
}

// Mount
onMounted(() => {
  // Any initialization logic can go here
})
</script>

<style lang="scss" scoped>
.student-dashboard {
  padding: 24px;
}

.welcome-header {
  border-radius: 16px;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgba(var(--v-theme-primary), 0.8) 100%);
  box-shadow: 0 8px 32px rgba(var(--v-theme-primary), 0.3);
}

.profile-illustration {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.profile-avatar {
  border: 4px solid rgba(var(--v-theme-primary), 0.2);
}

.illustration-image {
  block-size: auto;
  inline-size: 100%;
  max-inline-size: 250px;
}

.profile-data-card {
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 10%);
}

.profile-field {
  margin-block-end: 16px;
  
  &.incomplete {
    opacity: 0.7;
  }
}

.profile-field strong {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  margin-block-end: 4px;
}

.profile-value {
  border: 1px solid rgba(var(--v-theme-outline), 0.12);
  border-radius: 8px;
  margin: 0;
  background: rgba(var(--v-theme-surface), 0.5);
  font-size: 0.875rem;
  padding-block: 8px;
  padding-inline: 12px;
}

.profile-value-empty {
  border: 1px dashed rgba(var(--v-theme-warning), 0.5);
  border-radius: 8px;
  margin: 0;
  background: rgba(var(--v-theme-warning), 0.05);
  font-size: 0.875rem;
  font-style: italic;
  padding-block: 8px;
  padding-inline: 12px;
}

.stat-card {
  border-radius: 12px;
  transition: transform 0.2s ease;
  
  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 12%);
    transform: translateY(-2px);
  }
}

.guide-content {
  line-height: 1.6;
}

.guide-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background: rgba(var(--v-theme-primary), 0.05);
  margin-block-end: 12px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: rgba(var(--v-theme-primary), 0.1);
  }
}

@media (max-width: 768px) {
  .student-dashboard {
    padding: 16px;
  }

  .profile-illustration {
    padding: 16px;
  }
  
  .profile-avatar {
    block-size: 150px !important;
    inline-size: 150px !important;
  }
}
</style>
