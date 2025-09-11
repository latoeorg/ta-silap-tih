<template>
  <div class="student-dashboard">
    <!-- Welcome Header -->
    <VCard class="welcome-header mb-6" color="primary" variant="elevated">
      <VCardText class="pa-6">
        <VRow align="center" no-gutters>
          <VCol cols="auto">
            <VIcon icon="tabler-school" size="56" color="white" />
          </VCol>
          <VCol class="ml-4">
            <h1 class="text-h4 font-weight-bold text-white mb-1">
              Selamat Datang, {{ user?.name || "Siswa" }}! 👋
            </h1>
            <p class="text-h6 text-white opacity-90 mb-1">
              Sistem Informasi dan Layanan Siswa Polibatam
            </p>
            <p class="text-white opacity-75">
              Anda dapat menikmati layanan secara online 📱
            </p>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- Profile Completion Notice -->
    <VAlert
      v-if="getProfileCompletionPercentage() < 100"
      type="info"
      variant="tonal"
      class="mb-6"
      prominent
      closable
    >
      <VRow align="center" no-gutters>
        <VCol>
          <div class="text-subtitle-1 font-weight-medium mb-1">
            Lengkapi profil Anda ({{ getProfileCompletionPercentage() }}%
            selesai)
          </div>
          <div>
            Lengkapi profil Anda untuk mengakses semua fitur sistem secara
            optimal.
          </div>
        </VCol>
        <VCol cols="auto" class="ml-4">
          <VBtn
            color="primary"
            variant="elevated"
            prepend-icon="tabler-user-edit"
            to="/profile"
          >
            Lengkapi Profile
          </VBtn>
        </VCol>
      </VRow>
    </VAlert>

    <!-- Statistics Cards -->
    <VRow class="mb-6">
      <VCol
        v-for="stat in quickStats"
        :key="stat.title"
        cols="12"
        sm="6"
        md="3"
      >
        <VCard class="stat-card h-100">
          <VCardText class="text-center pa-6">
            <VIcon
              :icon="stat.icon"
              size="48"
              :color="stat.color"
              class="mb-3"
            />
            <div class="text-h5 font-weight-bold mb-1">
              {{ stat.value }}
            </div>
            <div class="text-body-2 text-medium-emphasis">
              {{ stat.title }}
            </div>
            <VProgressLinear
              v-if="stat.progress !== undefined"
              :model-value="stat.progress"
              :color="stat.color"
              class="mt-2"
              height="4"
            />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Main Content -->
    <VRow>
      <!-- Profile Information -->
      <VCol cols="12" md="4">
        <VCard class="profile-picture-card mb-4">
          <VCardText class="text-center pa-6">
            <VAvatar
              v-if="user.studentProfile?.profilePicture"
              :image="user.studentProfile.profilePicture"
              size="160"
              class="profile-avatar mb-4"
            />
            <VAvatar v-else size="160" color="grey-lighten-2" class="mb-4">
              <VIcon icon="tabler-user" size="64" color="grey-darken-1" />
            </VAvatar>

            <h3 class="text-h5 font-weight-bold mb-2">
              {{ user?.name || "Nama Belum Diisi" }}
            </h3>
            <p class="text-body-2 text-medium-emphasis mb-3">
              {{ user?.studentProfile?.number || "NIM Belum Diisi" }}
            </p>

            <VChip
              :color="getStatusColor(user.studentProfile?.status)"
              size="default"
              variant="elevated"
              class="mb-4"
            >
              <VIcon
                :icon="getStatusIcon(user.studentProfile?.status)"
                start
                size="16"
              />
              {{ getStatusText(user.studentProfile?.status) }}
            </VChip>

            <div class="profile-completion">
              <div class="text-body-2 text-medium-emphasis mb-2">
                Kelengkapan Profil
              </div>
              <VProgressCircular
                :model-value="getProfileCompletionPercentage()"
                :color="
                  getProfileCompletionPercentage() >= 80 ? 'success' : 'warning'
                "
                size="64"
                width="6"
              >
                <span class="text-caption font-weight-bold">
                  {{ getProfileCompletionPercentage() }}%
                </span>
              </VProgressCircular>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Profile Details -->
      <VCol cols="12" md="8">
        <VCard class="profile-data-card">
          <VCardTitle class="d-flex align-center bg-primary pa-4">
            <VIcon icon="tabler-user" class="me-2" color="white" />
            <span class="text-white font-weight-bold">DATA DIRI SISWA</span>
          </VCardTitle>

          <VCardText class="pa-6">
            <VRow>
              <!-- Personal Information Section -->
              <VCol cols="12">
                <div class="section-title mb-4">
                  <VIcon icon="tabler-id" color="primary" class="me-2" />
                  <span class="text-h6 font-weight-medium"
                    >Informasi Dasar</span
                  >
                </div>
              </VCol>

              <VCol
                v-for="field in basicInfoFields"
                :key="field.key"
                :cols="field.cols || 12"
                :sm="field.sm || 6"
                :md="field.md || 6"
              >
                <div class="profile-field">
                  <div class="field-label">
                    <VIcon
                      :icon="field.icon"
                      size="18"
                      :color="field.value ? 'primary' : 'warning'"
                      class="me-2"
                    />
                    <strong>{{ field.label }}</strong>
                  </div>
                  <div
                    :class="[
                      'profile-value',
                      { 'profile-value-empty': !field.value },
                    ]"
                  >
                    {{ field.value || "Belum diisi" }}
                  </div>
                </div>
              </VCol>

              <!-- Family Information Section -->
              <VCol cols="12" class="mt-4">
                <VDivider class="mb-4" />
                <div class="section-title mb-4">
                  <VIcon icon="tabler-users" color="primary" class="me-2" />
                  <span class="text-h6 font-weight-medium"
                    >Informasi Keluarga</span
                  >
                </div>
              </VCol>

              <VCol
                v-for="field in familyInfoFields"
                :key="field.key"
                :cols="field.cols || 12"
                :sm="field.sm || 6"
                :md="field.md || 6"
              >
                <div class="profile-field">
                  <div class="field-label">
                    <VIcon
                      :icon="field.icon"
                      size="18"
                      :color="field.value ? 'primary' : 'warning'"
                      class="me-2"
                    />
                    <strong>{{ field.label }}</strong>
                  </div>
                  <div
                    :class="[
                      'profile-value',
                      { 'profile-value-empty': !field.value },
                    ]"
                  >
                    {{ field.value || "Belum diisi" }}
                  </div>
                </div>
              </VCol>

              <!-- Address Section -->
              <VCol cols="12" class="mt-4">
                <VDivider class="mb-4" />
                <div class="section-title mb-4">
                  <VIcon icon="tabler-map-pin" color="primary" class="me-2" />
                  <span class="text-h6 font-weight-medium"
                    >Informasi Alamat</span
                  >
                </div>
              </VCol>

              <VCol cols="12">
                <div class="profile-field">
                  <div class="field-label">
                    <VIcon
                      icon="tabler-home"
                      size="18"
                      :color="
                        user?.studentProfile?.address ? 'primary' : 'warning'
                      "
                      class="me-2"
                    />
                    <strong>Alamat Lengkap</strong>
                  </div>
                  <div
                    :class="[
                      'profile-value',
                      { 'profile-value-empty': !user?.studentProfile?.address },
                    ]"
                  >
                    {{ user?.studentProfile?.address || "Belum diisi" }}
                  </div>
                </div>
              </VCol>
            </VRow>

            <VDivider class="my-6" />

            <!-- Action Buttons -->
            <div class="text-center">
              <VBtn
                color="primary"
                size="large"
                prepend-icon="tabler-edit"
                to="/profile"
                class="me-3 mb-2"
              >
                Lengkapi Profil
              </VBtn>
              <VBtn
                color="secondary"
                size="large"
                prepend-icon="tabler-refresh"
                variant="outlined"
                class="mb-2"
                @click="refreshProfile"
              >
                Refresh Data
              </VBtn>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Guide Section -->
    <VCard class="mt-6 guide-section">
      <VCardTitle class="d-flex align-center bg-info pa-4">
        <VIcon icon="tabler-book-open" class="me-2" color="white" />
        <span class="text-white font-weight-bold"
          >PANDUAN SISTEM INFORMASI DAN LAYANAN SISWA</span
        >
      </VCardTitle>

      <VCardText class="pa-6">
        <div class="guide-content">
          <p class="text-body-1 mb-4 text-medium-emphasis">
            Sistem ini dirancang untuk memudahkan siswa dalam mengakses berbagai
            layanan akademik dan administratif. Berikut adalah panduan
            penggunaan sistem:
          </p>

          <VRow>
            <VCol
              v-for="guide in guideItems"
              :key="guide.title"
              cols="12"
              sm="6"
              md="4"
            >
              <VCard class="guide-card h-100" variant="outlined" hover>
                <VCardText class="pa-4 text-center">
                  <VIcon
                    :icon="guide.icon"
                    :color="guide.color"
                    size="40"
                    class="mb-3"
                  />
                  <div class="text-subtitle-1 font-weight-bold mb-2">
                    {{ guide.title }}
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    {{ guide.description }}
                  </div>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        </div>
      </VCardText>
    </VCard>
  </div>
</template>

<script setup>
const store = useVuex();

// Computed
const user = computed(() => store.state.app.user);

// Data
const guideItems = [
  {
    title: "Lengkapi Profil",
    description:
      "Pastikan data diri Anda lengkap dan terkini untuk mengakses semua fitur",
    icon: "tabler-user-edit",
    color: "primary",
  },
  {
    title: "Akses Materi",
    description:
      "Unduh materi pembelajaran dan resources dari dosen pengampu mata kuliah",
    icon: "tabler-book-2",
    color: "success",
  },
  {
    title: "Jadwal Kuliah",
    description:
      "Lihat jadwal kuliah harian, mingguan dan jadwal ujian semester",
    icon: "tabler-calendar",
    color: "info",
  },
  {
    title: "Pantau Nilai",
    description:
      "Pantau nilai tugas, kuis, UTS, UAS dan IPK Anda secara real-time",
    icon: "tabler-chart-line",
    color: "warning",
  },
  {
    title: "Layanan Dokumen",
    description:
      "Ajukan dan unduh berbagai dokumen akademik seperti transkrip, surat keterangan",
    icon: "tabler-file-text",
    color: "secondary",
  },
  {
    title: "Bantuan Teknis",
    description:
      "Hubungi administrator sistem untuk bantuan teknis dan troubleshooting",
    icon: "tabler-help-circle",
    color: "error",
  },
];

// Computed properties
const quickStats = computed(() => [
  {
    title: "Status Siswa",
    value: getStatusText(user.value?.studentProfile?.status),
    icon: getStatusIcon(user.value?.studentProfile?.status),
    color: getStatusColor(user.value?.studentProfile?.status),
  },
  {
    title: "Kelengkapan Profil",
    value: `${getProfileCompletionPercentage()}%`,
    icon: "tabler-progress",
    color: getProfileCompletionPercentage() >= 80 ? "success" : "warning",
    progress: getProfileCompletionPercentage(),
  },
  {
    title: "Tanggal Bergabung",
    value: formatDate(user.value?.createdAt),
    icon: "tabler-calendar-plus",
    color: "info",
  },
  {
    title: "Update Terakhir",
    value: formatDate(user.value?.updatedAt),
    icon: "tabler-clock",
    color: "secondary",
  },
]);

const basicInfoFields = computed(() => [
  {
    key: "name",
    label: "Nama Lengkap",
    value: user.value?.name,
    icon: "tabler-user",
    cols: 12,
    sm: 6,
    md: 6,
  },
  {
    key: "email",
    label: "Email",
    value: user.value?.email,
    icon: "tabler-mail",
    cols: 12,
    sm: 6,
    md: 6,
  },
  {
    key: "number",
    label: "NIM",
    value: user.value?.studentProfile?.number,
    icon: "tabler-id",
    cols: 12,
    sm: 6,
    md: 4,
  },
  {
    key: "phone",
    label: "No. Telepon/HP",
    value: user.value?.studentProfile?.phone,
    icon: "tabler-phone",
    cols: 12,
    sm: 6,
    md: 4,
  },
  {
    key: "gender",
    label: "Jenis Kelamin",
    value: getGenderText(user.value?.studentProfile?.gender),
    icon: "tabler-gender-bigender",
    cols: 12,
    sm: 6,
    md: 4,
  },
  {
    key: "birthPlace",
    label: "Tempat Lahir",
    value: user.value?.studentProfile?.birthPlace,
    icon: "tabler-map-pin",
    cols: 12,
    sm: 6,
    md: 6,
  },
  {
    key: "birthDate",
    label: "Tanggal Lahir",
    value: user.value?.studentProfile?.birthDate
      ? formatDate(user.value.studentProfile.birthDate)
      : null,
    icon: "tabler-calendar",
    cols: 12,
    sm: 6,
    md: 6,
  },
]);

const familyInfoFields = computed(() => [
  {
    key: "fatherName",
    label: "Nama Ayah",
    value: user.value?.studentProfile?.fatherName,
    icon: "tabler-user",
    cols: 12,
    sm: 6,
    md: 6,
  },
  {
    key: "motherName",
    label: "Nama Ibu",
    value: user.value?.studentProfile?.motherName,
    icon: "tabler-user",
    cols: 12,
    sm: 6,
    md: 6,
  },
]);

// Methods
const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getGenderText = (gender) => {
  switch (gender) {
    case "MALE":
      return "Laki-laki";
    case "FEMALE":
      return "Perempuan";
    default:
      return null;
  }
};

const getStatusText = (status) => {
  switch (status) {
    case "ACTIVE":
      return "Aktif";
    case "INACTIVE":
      return "Tidak Aktif";
    case "SUSPENDED":
      return "Ditangguhkan";
    default:
      return "Tidak Diketahui";
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "ACTIVE":
      return "success";
    case "INACTIVE":
      return "error";
    case "SUSPENDED":
      return "warning";
    default:
      return "grey";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "ACTIVE":
      return "tabler-check-circle";
    case "INACTIVE":
      return "tabler-x-circle";
    case "SUSPENDED":
      return "tabler-alert-circle";
    default:
      return "tabler-help-circle";
  }
};

const getProfileCompletionPercentage = () => {
  if (!user.value) return 0;

  const fields = [
    user.value.studentProfile?.number,
    user.value.name,
    user.value.studentProfile?.birthPlace,
    user.value.studentProfile?.birthDate,
    user.value.studentProfile?.fatherName,
    user.value.studentProfile?.motherName,
    user.value.studentProfile?.address,
    user.value.studentProfile?.phone,
    user.value.email,
    user.value.studentProfile?.gender,
  ];

  const completedFields = fields.filter(
    (field) => field && field.toString().trim() !== ""
  ).length;

  return Math.round((completedFields / fields.length) * 100);
};

const refreshProfile = () => {
  // Add your profile refresh logic here
  console.log("Refreshing profile...");
  // You might want to dispatch a Vuex action here
  // store.dispatch('app/refreshUserProfile')
};

// Lifecycle
onMounted(() => {
  // Any initialization logic can go here
});
</script>

<style lang="scss" scoped>
.student-dashboard {
  padding: 24px;
  background-color: #f5f5f5;
}

.welcome-header {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)) 0%,
    rgba(var(--v-theme-primary), 0.85) 100%
  );
  box-shadow: 0 4px 20px rgba(var(--v-theme-primary), 0.3);
}

.stat-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(var(--v-theme-outline), 0.12);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
}

.profile-picture-card {
  border: 1px solid rgba(var(--v-theme-outline), 0.12);
}

.profile-avatar {
  border: 3px solid rgba(var(--v-theme-primary), 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.profile-completion {
  padding: 16px;
  background: rgba(var(--v-theme-surface), 0.5);
  border-radius: 8px;
  border: 1px solid rgba(var(--v-theme-outline), 0.12);
}

.profile-data-card {
  border: 1px solid rgba(var(--v-theme-outline), 0.12);
  overflow: hidden;
}

.section-title {
  display: flex;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 2px solid rgba(var(--v-theme-primary), 0.1);
}

.profile-field {
  margin-bottom: 20px;
}

.field-label {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.87);
}

.profile-value {
  padding: 12px 16px;
  background: rgba(var(--v-theme-surface), 0.8);
  border: 1px solid rgba(var(--v-theme-outline), 0.2);
  border-radius: 6px;
  font-size: 0.875rem;
  min-height: 44px;
  display: flex;
  align-items: center;
}

.profile-value-empty {
  background: rgba(var(--v-theme-warning), 0.05);
  border: 1px dashed rgba(var(--v-theme-warning), 0.4);
  color: rgba(var(--v-theme-warning), 0.8);
  font-style: italic;
}

.guide-section {
  border: 1px solid rgba(var(--v-theme-outline), 0.12);
}

.guide-card {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
}

.guide-content {
  line-height: 1.6;
}

// Responsive Design
@media (max-width: 960px) {
  .student-dashboard {
    padding: 16px;
  }
}

@media (max-width: 600px) {
  .student-dashboard {
    padding: 12px;
  }

  .welcome-header .text-h4 {
    font-size: 1.5rem !important;
  }

  .profile-avatar {
    width: 120px !important;
    height: 120px !important;
  }

  .stat-card .text-h5 {
    font-size: 1.125rem !important;
  }
}

// Dark theme adjustments
.v-theme--dark {
  .student-dashboard {
    background-color: rgb(var(--v-theme-background));
  }

  .profile-value {
    background: rgba(var(--v-theme-surface), 0.6);
    border-color: rgba(var(--v-theme-outline), 0.3);
  }

  .section-title {
    border-bottom-color: rgba(var(--v-theme-primary), 0.3);
  }
}
</style>
