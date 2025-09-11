<template>
  <div class="teacher-dashboard">
    <!-- Welcome Header -->
    <VCard class="welcome-header mb-6" color="success" variant="elevated">
      <VCardText class="pa-6">
        <VRow align="center" no-gutters>
          <VCol cols="auto">
            <VIcon icon="tabler-chalkboard-teacher" size="56" color="white" />
          </VCol>
          <VCol class="ml-4">
            <h1 class="text-h4 font-weight-bold text-white mb-1">
              Selamat Datang, {{ user?.name || "Guru" }}! 👋
            </h1>
            <p class="text-h6 text-white opacity-90 mb-1">
              Dashboard Pengajar - Sistem Informasi Akademik
            </p>
            <p class="text-white opacity-75">
              Kelola kelas dan pantau perkembangan siswa dengan mudah 📚
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
              v-if="user.teacherProfile?.profilePicture"
              :image="user.teacherProfile.profilePicture"
              size="160"
              class="profile-avatar mb-4"
            />
            <VAvatar
              v-else
              size="160"
              color="success"
              variant="tonal"
              class="mb-4"
            >
              <span class="text-h3">{{ getInitials(user.name) }}</span>
            </VAvatar>

            <h3 class="text-h5 font-weight-bold mb-2">
              {{ user?.name || "Nama Lengkap" }}
            </h3>
            <p class="text-body-2 text-medium-emphasis mb-3">
              {{ user?.email || "Email Address" }}
            </p>

            <VChip
              color="success"
              variant="tonal"
              prepend-icon="tabler-chalkboard-teacher"
              class="mb-4"
            >
              Pengajar
            </VChip>

            <div class="profile-completion">
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-body-2">Kelengkapan Profil</span>
                <span class="text-body-2 font-weight-bold"
                  >{{ getProfileCompletionPercentage() }}%</span
                >
              </div>
              <VProgressLinear
                :model-value="getProfileCompletionPercentage()"
                :color="
                  getProfileCompletionPercentage() >= 80 ? 'success' : 'warning'
                "
                height="8"
                rounded
              />
            </div>
          </VCardText>
        </VCard>

        <!-- Quick Actions -->
        <VCard>
          <VCardTitle>
            <VIcon icon="tabler-bolt" class="me-2" />
            Aksi Cepat
          </VCardTitle>
          <VDivider />
          <VCardText>
            <VList>
              <VListItem
                prepend-icon="tabler-user-edit"
                title="Edit Profil"
                subtitle="Perbarui informasi pribadi"
                @click="$router.push('/profile')"
              />
              <VListItem
                prepend-icon="tabler-school"
                title="Kelola Kelas"
                subtitle="Lihat dan kelola kelas"
                @click="$router.push('/course')"
              />
              <VListItem
                prepend-icon="tabler-chart-line"
                title="Laporan Nilai"
                subtitle="Lihat laporan nilai siswa"
                @click="$router.push('/reports')"
              />
            </VList>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Profile Details -->
      <VCol cols="12" md="8">
        <VCard class="profile-data-card">
          <VCardTitle class="d-flex align-center bg-success pa-4">
            <VIcon icon="tabler-user" class="me-2" color="white" />
            <span class="text-white font-weight-bold">DATA DIRI PENGAJAR</span>
          </VCardTitle>

          <VCardText class="pa-6">
            <!-- Basic Information -->
            <div class="section-title mb-4">
              <VIcon icon="tabler-user" class="me-2" color="primary" />
              <span class="text-h6 font-weight-bold">Informasi Dasar</span>
            </div>

            <VRow>
              <VCol
                v-for="field in basicInfoFields"
                :key="field.key"
                :cols="field.cols"
                :sm="field.sm"
                :md="field.md"
              >
                <div class="profile-field">
                  <div class="field-label">
                    <VIcon :icon="field.icon" size="16" class="me-1" />
                    {{ field.label }}
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
            </VRow>

            <!-- Professional Information -->
            <div class="section-title mb-4 mt-6">
              <VIcon icon="tabler-briefcase" class="me-2" color="primary" />
              <span class="text-h6 font-weight-bold"
                >Informasi Profesional</span
              >
            </div>

            <VRow>
              <VCol
                v-for="field in professionalInfoFields"
                :key="field.key"
                :cols="field.cols"
                :sm="field.sm"
                :md="field.md"
              >
                <div class="profile-field">
                  <div class="field-label">
                    <VIcon :icon="field.icon" size="16" class="me-1" />
                    {{ field.label }}
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
            </VRow>

            <VDivider class="my-6" />

            <!-- Teaching Statistics -->
            <div class="section-title mb-4">
              <VIcon icon="tabler-chart-bar" class="me-2" color="primary" />
              <span class="text-h6 font-weight-bold">Statistik Mengajar</span>
            </div>

            <VRow>
              <VCol cols="12" sm="4">
                <div class="stat-box">
                  <VIcon
                    icon="tabler-school"
                    color="primary"
                    size="32"
                    class="mb-2"
                  />
                  <div class="text-h4 font-weight-bold">
                    {{ statistics.totalClasses }}
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    Kelas Diampu
                  </div>
                </div>
              </VCol>
              <VCol cols="12" sm="4">
                <div class="stat-box">
                  <VIcon
                    icon="tabler-users"
                    color="info"
                    size="32"
                    class="mb-2"
                  />
                  <div class="text-h4 font-weight-bold">
                    {{ statistics.totalStudents }}
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    Total Siswa
                  </div>
                </div>
              </VCol>
              <VCol cols="12" sm="4">
                <div class="stat-box">
                  <VIcon
                    icon="tabler-book"
                    color="warning"
                    size="32"
                    class="mb-2"
                  />
                  <div class="text-h4 font-weight-bold">
                    {{ statistics.totalSubjects }}
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    Mata Pelajaran
                  </div>
                </div>
              </VCol>
            </VRow>

            <!-- Action Buttons -->
            <div class="text-center mt-6">
              <VBtn
                color="primary"
                variant="elevated"
                prepend-icon="tabler-user-edit"
                size="large"
                class="me-3"
                to="/profile"
              >
                Edit Profil Lengkap
              </VBtn>
              <VBtn
                color="success"
                variant="outlined"
                prepend-icon="tabler-refresh"
                size="large"
                @click="refreshProfile"
              >
                Refresh Data
              </VBtn>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- My Classes Section -->
    <VCard class="mt-6">
      <VCardTitle class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <VIcon icon="tabler-school" class="me-2" color="primary" />
          Kelas yang Diampu
        </div>
        <VBtn
          color="primary"
          variant="outlined"
          size="small"
          prepend-icon="tabler-plus"
          to="/course"
        >
          Lihat Semua
        </VBtn>
      </VCardTitle>

      <VDivider />

      <VCardText>
        <div v-if="loading" class="text-center py-8">
          <VProgressCircular indeterminate size="32" color="primary" />
          <p class="text-body-2 mt-2">Memuat kelas...</p>
        </div>

        <div v-else-if="myClasses.length === 0" class="text-center py-8">
          <VIcon
            icon="tabler-school-off"
            size="48"
            color="disabled"
            class="mb-2"
          />
          <p class="text-body-2 text-disabled">Belum ada kelas yang diampu</p>
        </div>

        <VRow v-else>
          <VCol
            v-for="classItem in myClasses"
            :key="classItem.id"
            cols="12"
            sm="6"
            md="4"
          >
            <VCard
              class="class-item-card h-100"
              :to="`/course/${classItem.id}`"
            >
              <VCardText class="pa-4">
                <div class="d-flex align-center mb-3">
                  <VIcon
                    icon="tabler-book"
                    color="primary"
                    size="24"
                    class="me-2"
                  />
                  <span class="text-h6 font-weight-bold">{{
                    classItem.subject?.name || "Mata Pelajaran"
                  }}</span>
                </div>
                <div class="d-flex align-center mb-2">
                  <VIcon
                    icon="tabler-users"
                    color="info"
                    size="20"
                    class="me-2"
                  />
                  <span class="text-body-2">{{
                    classItem.classGroup?.name || "Kelas"
                  }}</span>
                </div>
                <div class="d-flex align-center">
                  <VIcon
                    icon="tabler-user-group"
                    color="success"
                    size="20"
                    class="me-2"
                  />
                  <span class="text-body-2"
                    >{{ classItem.enrollments?.length || 0 }} Siswa</span
                  >
                </div>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </div>
</template>

<script setup>
import { formatRelativeTime } from "@/utils/formatters";

const store = useVuex();

// State
const loading = ref(true);
const statistics = ref({
  totalClasses: 0,
  totalStudents: 0,
  totalSubjects: 0,
});
const myClasses = ref([]);

// Computed
const user = computed(() => store.state.app.user);

// Computed properties for profile fields
const quickStats = computed(() => [
  {
    title: "Status Pengajar",
    value: getStatusText(user.value?.teacherProfile?.status),
    icon: getStatusIcon(user.value?.teacherProfile?.status),
    color: getStatusColor(user.value?.teacherProfile?.status),
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
    label: "NIP",
    value: user.value?.teacherProfile?.number,
    icon: "tabler-id",
    cols: 12,
    sm: 6,
    md: 4,
  },
  {
    key: "phone",
    label: "No. Telepon/HP",
    value: user.value?.teacherProfile?.phone,
    icon: "tabler-phone",
    cols: 12,
    sm: 6,
    md: 4,
  },
  {
    key: "gender",
    label: "Jenis Kelamin",
    value: getGenderText(user.value?.teacherProfile?.gender),
    icon: "tabler-gender-bigender",
    cols: 12,
    sm: 6,
    md: 4,
  },
  {
    key: "birthPlace",
    label: "Tempat Lahir",
    value: user.value?.teacherProfile?.birthPlace,
    icon: "tabler-map-pin",
    cols: 12,
    sm: 6,
    md: 6,
  },
  {
    key: "birthDate",
    label: "Tanggal Lahir",
    value: user.value?.teacherProfile?.birthDate
      ? formatDate(user.value.teacherProfile.birthDate)
      : null,
    icon: "tabler-calendar",
    cols: 12,
    sm: 6,
    md: 6,
  },
  {
    key: "address",
    label: "Alamat",
    value: user.value?.teacherProfile?.address,
    icon: "tabler-map",
    cols: 12,
    sm: 12,
    md: 12,
  },
]);

const professionalInfoFields = computed(() => [
  {
    key: "titlePrefix",
    label: "Gelar Depan",
    value: user.value?.teacherProfile?.titlePrefix,
    icon: "tabler-award",
    cols: 12,
    sm: 6,
    md: 6,
  },
  {
    key: "titleSuffix",
    label: "Gelar Belakang",
    value: user.value?.teacherProfile?.titleSuffix,
    icon: "tabler-award",
    cols: 12,
    sm: 6,
    md: 6,
  },
  {
    key: "religion",
    label: "Agama",
    value: getReligionText(user.value?.teacherProfile?.religion),
    icon: "tabler-heart",
    cols: 12,
    sm: 6,
    md: 4,
  },
  {
    key: "unit",
    label: "Unit Kerja",
    value: user.value?.teacherProfile?.unit,
    icon: "tabler-building",
    cols: 12,
    sm: 6,
    md: 4,
  },
  {
    key: "status",
    label: "Status Kepegawaian",
    value: getStatusText(user.value?.teacherProfile?.status),
    icon: "tabler-user-check",
    cols: 12,
    sm: 6,
    md: 4,
  },
]);

// Methods
const getInitials = (name) => {
  return (
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U"
  );
};

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

const getReligionText = (religion) => {
  switch (religion) {
    case "ISLAM":
      return "Islam";
    case "CHRISTIAN":
      return "Kristen";
    case "CATHOLIC":
      return "Katolik";
    case "HINDU":
      return "Hindu";
    case "BUDDHIST":
      return "Buddha";
    case "CONFUCIAN":
      return "Konghucu";
    case "OTHER":
      return "Lainnya";
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
    case "LEAVE":
      return "Cuti";
    case "RETIRED":
      return "Pensiun";
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
    case "LEAVE":
      return "warning";
    case "RETIRED":
      return "info";
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
    case "LEAVE":
      return "tabler-clock";
    case "RETIRED":
      return "tabler-user-minus";
    default:
      return "tabler-help-circle";
  }
};

const getProfileCompletionPercentage = () => {
  if (!user.value) return 0;

  const fields = [
    user.value.teacherProfile?.number,
    user.value.name,
    user.value.teacherProfile?.birthPlace,
    user.value.teacherProfile?.birthDate,
    user.value.teacherProfile?.religion,
    user.value.teacherProfile?.unit,
    user.value.teacherProfile?.address,
    user.value.teacherProfile?.phone,
    user.value.email,
    user.value.teacherProfile?.gender,
  ];

  const completedFields = fields.filter(
    (field) => field && field.toString().trim() !== ""
  ).length;

  return Math.round((completedFields / fields.length) * 100);
};

const fetchDashboardData = async () => {
  loading.value = true;

  try {
    await Promise.all([fetchStatistics(), fetchMyClasses()]);
  } catch (error) {
    console.error("Failed to fetch teacher dashboard data:", error);
  } finally {
    loading.value = false;
  }
};

const fetchStatistics = async () => {
  // Replace with actual API call
  statistics.value = {
    totalClasses: 3,
    totalStudents: 85,
    totalSubjects: 2,
  };
};

const fetchMyClasses = async () => {
  // Replace with actual API call
  myClasses.value = [
    {
      id: 1,
      subject: { name: "Matematika" },
      classGroup: { name: "XI IPA 1" },
      enrollments: new Array(28).fill(null),
    },
    {
      id: 2,
      subject: { name: "Matematika" },
      classGroup: { name: "XI IPA 2" },
      enrollments: new Array(30).fill(null),
    },
    {
      id: 3,
      subject: { name: "Fisika" },
      classGroup: { name: "XI IPA 1" },
      enrollments: new Array(27).fill(null),
    },
  ];
};

const refreshProfile = () => {
  // Add your profile refresh logic here
  console.log("Refreshing profile...");
  fetchDashboardData();
};

// Mount
onMounted(() => {
  fetchDashboardData();
});
</script>

<style lang="scss" scoped>
.teacher-dashboard {
  padding: 24px;
  background-color: #f5f5f5;
}

.welcome-header {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-success)) 0%,
    rgba(var(--v-theme-success), 0.85) 100%
  );
  box-shadow: 0 4px 20px rgba(var(--v-theme-success), 0.3);
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
  border: 3px solid rgba(var(--v-theme-success), 0.2);
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

.stat-box {
  text-align: center;
  padding: 20px;
  background: rgba(var(--v-theme-surface), 0.8);
  border-radius: 12px;
  border: 1px solid rgba(var(--v-theme-outline), 0.12);
}

.class-item-card {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
}

// Responsive Design
@media (max-width: 960px) {
  .teacher-dashboard {
    padding: 16px;
  }
}

@media (max-width: 600px) {
  .teacher-dashboard {
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
  .teacher-dashboard {
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
