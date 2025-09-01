<template>
  <div class="student-dashboard">
    <div class="dashboard-header">
      <div class="header-content">
        <VIcon
          icon="tabler-school"
          size="48"
          color="info"
          class="header-icon"
        />
        <div>
          <h1 class="text-h4 font-weight-bold text-info">Dashboard Siswa</h1>
          <p class="text-body-1 text-medium-emphasis">
            Kelola profil Anda dan pantau pembelajaran
          </p>
        </div>
      </div>
      <div class="header-actions">
        <VChip color="info" variant="tonal" prepend-icon="tabler-school">
          Siswa
        </VChip>
      </div>
    </div>

    <VRow>
      <!-- Profile Information -->
      <VCol cols="12" md="4">
        <VCard class="profile-card">
          <VCardText class="text-center">
            <VAvatar size="120" class="mb-4" color="info" variant="tonal">
              <VImg v-if="user.photo" :src="user.photo" cover />
              <span v-else class="text-h4">
                {{ getInitials(user.name) }}
              </span>
            </VAvatar>

            <h3 class="text-h5 mb-2">{{ user.name }}</h3>
            <p class="text-body-2 text-medium-emphasis mb-1">
              {{ user.email }}
            </p>
            <VChip size="small" color="info" variant="tonal" class="mb-4">
              {{ studentProfile.number || "Siswa" }}
            </VChip>

            <VBtn
              color="info"
              variant="outlined"
              prepend-icon="tabler-user-edit"
              @click="editProfile = true"
            >
              Edit Profil
            </VBtn>
          </VCardText>
        </VCard>

        <!-- Academic Summary -->
        <VCard class="mt-4">
          <VCardTitle class="d-flex align-center">
            <VIcon icon="tabler-chart-line" class="me-2" color="info" />
            Ringkasan Akademik
          </VCardTitle>

          <VDivider />

          <VCardText>
            <div class="academic-stats">
              <div class="stat-item">
                <div class="stat-icon">
                  <VIcon icon="tabler-book" color="primary" />
                </div>
                <div class="stat-details">
                  <h4 class="stat-number">
                    {{ statistics.totalSubjects || 0 }}
                  </h4>
                  <p class="stat-label">Mata Pelajaran</p>
                </div>
              </div>

              <div class="stat-item">
                <div class="stat-icon">
                  <VIcon icon="tabler-percentage" color="success" />
                </div>
                <div class="stat-details">
                  <h4 class="stat-number">
                    {{ statistics.averageGrade || 0 }}%
                  </h4>
                  <p class="stat-label">Rata-rata Nilai</p>
                </div>
              </div>

              <div class="stat-item">
                <div class="stat-icon">
                  <VIcon icon="tabler-calendar-check" color="warning" />
                </div>
                <div class="stat-details">
                  <h4 class="stat-number">
                    {{ statistics.attendanceRate || 0 }}%
                  </h4>
                  <p class="stat-label">Kehadiran</p>
                </div>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Main Content -->
      <VCol cols="12" md="8">
        <!-- My Courses -->
        <VCard class="courses-card">
          <VCardTitle class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <VIcon icon="tabler-book-2" class="me-2" color="primary" />
              Mata Pelajaran Saya
            </div>
            <VBtn
              color="primary"
              variant="outlined"
              size="small"
              prepend-icon="tabler-eye"
              to="/course"
            >
              Lihat Semua
            </VBtn>
          </VCardTitle>

          <VDivider />

          <VCardText>
            <div v-if="loading" class="text-center py-8">
              <VProgressCircular indeterminate size="32" color="primary" />
              <p class="text-body-2 mt-2">Memuat mata pelajaran...</p>
            </div>

            <div v-else-if="myCourses.length === 0" class="text-center py-8">
              <VIcon
                icon="tabler-book-off"
                size="48"
                color="disabled"
                class="mb-2"
              />
              <p class="text-body-2 text-disabled">
                Belum terdaftar dalam mata pelajaran
              </p>
            </div>

            <VRow v-else>
              <VCol
                v-for="course in myCourses"
                :key="course.id"
                cols="12"
                sm="6"
              >
                <VCard class="course-item-card" :to="`/course/${course.id}`">
                  <VCardText>
                    <div class="d-flex align-center mb-3">
                      <VAvatar
                        size="40"
                        color="primary"
                        variant="tonal"
                        class="me-3"
                      >
                        <VIcon icon="tabler-book" />
                      </VAvatar>
                      <div>
                        <h6 class="text-subtitle-1 font-weight-medium">
                          {{ course.subject?.name }}
                        </h6>
                        <p class="text-body-2 text-medium-emphasis">
                          {{ course.teacher?.name }}
                        </p>
                      </div>
                    </div>

                    <div class="course-stats">
                      <VChip
                        size="small"
                        :color="getGradeColor(course.currentGrade)"
                        variant="tonal"
                        class="me-2"
                      >
                        <VIcon icon="tabler-chart-line" size="14" start />
                        {{ course.currentGrade || 0 }}%
                      </VChip>

                      <VChip
                        size="small"
                        :color="getAttendanceColor(course.attendanceRate)"
                        variant="tonal"
                      >
                        <VIcon icon="tabler-calendar-check" size="14" start />
                        {{ course.attendanceRate || 0 }}%
                      </VChip>
                    </div>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>

        <!-- Recent Activities & Assignments -->
        <VRow class="mt-4">
          <VCol cols="12" md="6">
            <VCard>
              <VCardTitle class="d-flex align-center">
                <VIcon icon="tabler-clock" class="me-2" color="warning" />
                Aktivitas Terbaru
              </VCardTitle>

              <VDivider />

              <VCardText>
                <div v-if="loading" class="text-center py-8">
                  <VProgressCircular indeterminate size="32" color="primary" />
                  <p class="text-body-2 mt-2">Memuat aktivitas...</p>
                </div>

                <div
                  v-else-if="recentActivities.length === 0"
                  class="text-center py-8"
                >
                  <VIcon
                    icon="tabler-inbox"
                    size="48"
                    color="disabled"
                    class="mb-2"
                  />
                  <p class="text-body-2 text-disabled">Belum ada aktivitas</p>
                </div>

                <VList v-else density="compact">
                  <VListItem
                    v-for="activity in recentActivities"
                    :key="activity.id"
                    class="activity-item"
                  >
                    <template #prepend>
                      <VAvatar
                        size="32"
                        :color="activity.color"
                        variant="tonal"
                      >
                        <VIcon :icon="activity.icon" size="16" />
                      </VAvatar>
                    </template>

                    <VListItemTitle class="activity-title">
                      {{ activity.title }}
                    </VListItemTitle>
                    <VListItemSubtitle class="activity-description">
                      {{ activity.description }}
                    </VListItemSubtitle>
                  </VListItem>
                </VList>
              </VCardText>
            </VCard>
          </VCol>

          <VCol cols="12" md="6">
            <VCard>
              <VCardTitle class="d-flex align-center">
                <VIcon
                  icon="tabler-clipboard-list"
                  class="me-2"
                  color="error"
                />
                Tugas Mendatang
              </VCardTitle>

              <VDivider />

              <VCardText>
                <div v-if="loading" class="text-center py-8">
                  <VProgressCircular indeterminate size="32" color="primary" />
                  <p class="text-body-2 mt-2">Memuat tugas...</p>
                </div>

                <div
                  v-else-if="upcomingAssignments.length === 0"
                  class="text-center py-8"
                >
                  <VIcon
                    icon="tabler-clipboard-check"
                    size="48"
                    color="disabled"
                    class="mb-2"
                  />
                  <p class="text-body-2 text-disabled">
                    Tidak ada tugas mendatang
                  </p>
                </div>

                <VList v-else density="compact">
                  <VListItem
                    v-for="assignment in upcomingAssignments"
                    :key="assignment.id"
                    class="assignment-item"
                  >
                    <template #prepend>
                      <VAvatar
                        size="32"
                        :color="getAssignmentPriorityColor(assignment.priority)"
                        variant="tonal"
                      >
                        <VIcon icon="tabler-clipboard" size="16" />
                      </VAvatar>
                    </template>

                    <VListItemTitle class="assignment-title">
                      {{ assignment.title }}
                    </VListItemTitle>
                    <VListItemSubtitle class="assignment-subject">
                      {{ assignment.subject }} •
                      {{ formatDate(assignment.dueDate) }}
                    </VListItemSubtitle>
                  </VListItem>
                </VList>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VCol>
    </VRow>

    <!-- Edit Profile Dialog -->
    <VDialog v-model="editProfile" max-width="600">
      <VCard>
        <VCardTitle class="d-flex align-center">
          <VIcon icon="tabler-user-edit" class="me-2" />
          Edit Profil
        </VCardTitle>

        <VDivider />

        <VCardText>
          <VForm @submit.prevent="updateProfile">
            <VRow>
              <VCol cols="12">
                <VTextField
                  v-model="profileForm.name"
                  label="Nama Lengkap"
                  prepend-inner-icon="tabler-user"
                  variant="outlined"
                />
              </VCol>

              <VCol cols="12">
                <VTextField
                  v-model="profileForm.email"
                  label="Email"
                  type="email"
                  prepend-inner-icon="tabler-mail"
                  variant="outlined"
                  readonly
                />
              </VCol>

              <VCol cols="12" sm="6">
                <VTextField
                  v-model="profileForm.number"
                  label="Nomor Induk Siswa"
                  prepend-inner-icon="tabler-id"
                  variant="outlined"
                />
              </VCol>

              <VCol cols="12" sm="6">
                <VTextField
                  v-model="profileForm.phone"
                  label="Nomor Telepon"
                  prepend-inner-icon="tabler-phone"
                  variant="outlined"
                />
              </VCol>

              <VCol cols="12">
                <VTextarea
                  v-model="profileForm.address"
                  label="Alamat"
                  prepend-inner-icon="tabler-home"
                  variant="outlined"
                  rows="3"
                />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>

        <VCardActions>
          <VSpacer />
          <VBtn variant="outlined" @click="editProfile = false"> Batal </VBtn>
          <VBtn color="primary" @click="updateProfile"> Simpan </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup>
import { formatRelativeTime } from "@/utils/formatters";

const store = useVuex();

// State
const loading = ref(true);
const editProfile = ref(false);
const statistics = ref({
  totalSubjects: 0,
  averageGrade: 0,
  attendanceRate: 0,
});
const myCourses = ref([]);
const recentActivities = ref([]);
const upcomingAssignments = ref([]);
const studentProfile = ref({});
const profileForm = ref({
  name: "",
  email: "",
  number: "",
  phone: "",
  address: "",
});

// Computed
const user = computed(() => store.state.app.user);

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

const getGradeColor = (grade) => {
  if (grade >= 85) return "success";
  if (grade >= 75) return "info";
  if (grade >= 65) return "warning";
  return "error";
};

const getAttendanceColor = (rate) => {
  if (rate >= 90) return "success";
  if (rate >= 80) return "info";
  if (rate >= 70) return "warning";
  return "error";
};

const getAssignmentPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "error";
    case "medium":
      return "warning";
    case "low":
      return "info";
    default:
      return "primary";
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
};

const fetchDashboardData = async () => {
  loading.value = true;

  try {
    await Promise.all([
      fetchStatistics(),
      fetchMyCourses(),
      fetchRecentActivities(),
      fetchUpcomingAssignments(),
    ]);
  } catch (error) {
    console.error("Failed to fetch student dashboard data:", error);
  } finally {
    loading.value = false;
  }
};

const fetchStatistics = async () => {
  // Replace with actual API call
  statistics.value = {
    totalSubjects: 6,
    averageGrade: 78,
    attendanceRate: 92,
  };
};

const fetchMyCourses = async () => {
  // Replace with actual API call
  myCourses.value = [
    {
      id: 1,
      subject: { name: "Matematika" },
      teacher: { name: "Bu Sarah" },
      currentGrade: 85,
      attendanceRate: 95,
    },
    {
      id: 2,
      subject: { name: "Bahasa Indonesia" },
      teacher: { name: "Pak Ahmad" },
      currentGrade: 78,
      attendanceRate: 88,
    },
    {
      id: 3,
      subject: { name: "Fisika" },
      teacher: { name: "Bu Rina" },
      currentGrade: 72,
      attendanceRate: 92,
    },
    {
      id: 4,
      subject: { name: "Kimia" },
      teacher: { name: "Pak Budi" },
      currentGrade: 80,
      attendanceRate: 90,
    },
  ];
};

const fetchRecentActivities = async () => {
  // Replace with actual API call
  recentActivities.value = [
    {
      id: 1,
      title: "Nilai tugas diterima",
      description: "Matematika - Tugas Aljabar",
      icon: "tabler-check",
      color: "success",
    },
    {
      id: 2,
      title: "Kehadiran dicatat",
      description: "Fisika - Hari ini",
      icon: "tabler-calendar-check",
      color: "info",
    },
    {
      id: 3,
      title: "Tugas baru tersedia",
      description: "Kimia - Praktikum Lab",
      icon: "tabler-clipboard-plus",
      color: "warning",
    },
  ];
};

const fetchUpcomingAssignments = async () => {
  // Replace with actual API call
  upcomingAssignments.value = [
    {
      id: 1,
      title: "Essay Sejarah Indonesia",
      subject: "Sejarah",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      priority: "high",
    },
    {
      id: 2,
      title: "Praktikum Kimia Organik",
      subject: "Kimia",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      priority: "medium",
    },
    {
      id: 3,
      title: "Soal Matematika Bab 3",
      subject: "Matematika",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      priority: "low",
    },
  ];
};

const updateProfile = async () => {
  try {
    // Replace with actual API call
    console.log("Updating profile:", profileForm.value);
    editProfile.value = false;
  } catch (error) {
    console.error("Failed to update profile:", error);
  }
};

// Initialize profile form
const initializeProfileForm = () => {
  profileForm.value = {
    name: user.value.name || "",
    email: user.value.email || "",
    number: studentProfile.value.number || "",
    phone: user.value.phone || "",
    address: user.value.address || "",
  };
};

// Watch for changes in user data
watch(
  () => user.value,
  () => {
    initializeProfileForm();
  },
  { immediate: true }
);

// Mount
onMounted(() => {
  fetchDashboardData();
});
</script>

<style lang="scss" scoped>
.student-dashboard {
  padding: 24px;
}

.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  padding: 24px;
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-info), 0.1) 0%,
    rgba(var(--v-theme-info), 0.05) 100%
  );
  border-radius: 16px;
  border: 1px solid rgba(var(--v-theme-info), 0.12);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  padding: 16px;
  background: rgba(var(--v-theme-info), 0.1);
  border-radius: 12px;
}

.profile-card {
  position: sticky;
  top: 24px;
}

.academic-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(var(--v-theme-surface), 0.5);
  border-radius: 8px;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(var(--v-theme-primary), 0.1);
}

.stat-details {
  flex: 1;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2px;
  color: rgb(var(--v-theme-on-surface));
}

.stat-label {
  color: rgb(var(--v-theme-on-surface-variant));
  font-size: 0.75rem;
  margin: 0;
}

.courses-card {
  height: fit-content;
}

.course-item-card {
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
}

.course-stats {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.activity-item,
.assignment-item {
  border-radius: 8px;
  margin-bottom: 4px;

  &:hover {
    background: rgba(var(--v-theme-surface), 0.5);
  }
}

.activity-title,
.assignment-title {
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}

.activity-description,
.assignment-subject {
  color: rgb(var(--v-theme-on-surface-variant));
}

@media (max-width: 768px) {
  .student-dashboard {
    padding: 16px;
  }

  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .profile-card {
    position: static;
  }
}
</style>
