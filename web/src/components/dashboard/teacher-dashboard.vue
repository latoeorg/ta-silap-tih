<template>
  <div class="teacher-dashboard">
    <div class="dashboard-header">
      <div class="header-content">
        <VIcon
          icon="tabler-chalkboard-teacher"
          size="48"
          color="success"
          class="header-icon"
        />
        <div>
          <h1 class="text-h4 font-weight-bold text-success">Dashboard Guru</h1>
          <p class="text-body-1 text-medium-emphasis">
            Kelola profil Anda dan pantau kelas yang diampu
          </p>
        </div>
      </div>
      <div class="header-actions">
        <VChip
          color="success"
          variant="tonal"
          prepend-icon="tabler-chalkboard-teacher"
        >
          Guru
        </VChip>
      </div>
    </div>

    <VRow>
      <!-- Profile Information -->
      <VCol cols="12" md="4">
        <VCard class="profile-card">
          <VCardText class="text-center">
            <VAvatar size="120" class="mb-4" color="success" variant="tonal">
              <VImg v-if="user.photo" :src="user.photo" cover />
              <span v-else class="text-h4">
                {{ getInitials(user.name) }}
              </span>
            </VAvatar>

            <h3 class="text-h5 mb-2">{{ user.name }}</h3>
            <p class="text-body-2 text-medium-emphasis mb-4">
              {{ user.email }}
            </p>

            <VBtn
              color="success"
              variant="outlined"
              prepend-icon="tabler-user-edit"
              @click="editProfile = true"
            >
              Edit Profil
            </VBtn>
          </VCardText>
        </VCard>

        <!-- Quick Stats -->
        <VCard class="mt-4">
          <VCardTitle class="d-flex align-center">
            <VIcon icon="tabler-chart-bar" class="me-2" color="success" />
            Ringkasan
          </VCardTitle>

          <VDivider />

          <VCardText>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-icon">
                  <VIcon icon="tabler-school" color="primary" />
                </div>
                <div class="stat-details">
                  <h4 class="stat-number">
                    {{ statistics.totalClasses || 0 }}
                  </h4>
                  <p class="stat-label">Kelas Diampu</p>
                </div>
              </div>

              <div class="stat-item">
                <div class="stat-icon">
                  <VIcon icon="tabler-users" color="info" />
                </div>
                <div class="stat-details">
                  <h4 class="stat-number">
                    {{ statistics.totalStudents || 0 }}
                  </h4>
                  <p class="stat-label">Total Siswa</p>
                </div>
              </div>

              <div class="stat-item">
                <div class="stat-icon">
                  <VIcon icon="tabler-book" color="warning" />
                </div>
                <div class="stat-details">
                  <h4 class="stat-number">
                    {{ statistics.totalSubjects || 0 }}
                  </h4>
                  <p class="stat-label">Mata Pelajaran</p>
                </div>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Main Content -->
      <VCol cols="12" md="8">
        <!-- My Classes -->
        <VCard class="classes-card">
          <VCardTitle class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <VIcon icon="tabler-school" class="me-2" color="primary" />
              Kelas Saya
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
              <p class="text-body-2 text-disabled">
                Belum ada kelas yang diampu
              </p>
            </div>

            <VRow v-else>
              <VCol
                v-for="classItem in myClasses"
                :key="classItem.id"
                cols="12"
                sm="6"
              >
                <VCard class="class-item-card" :to="`/course/${classItem.id}`">
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
                          {{ classItem.subject?.name }}
                        </h6>
                        <p class="text-body-2 text-medium-emphasis">
                          {{ classItem.classGroup?.name }}
                        </p>
                      </div>
                    </div>

                    <div class="class-stats">
                      <VChip size="small" color="info" variant="tonal">
                        <VIcon icon="tabler-users" size="14" start />
                        {{ classItem.enrollments?.length || 0 }} siswa
                      </VChip>
                    </div>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>

        <!-- Recent Activities -->
        <VCard class="mt-4">
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

            <VList v-else>
              <VListItem
                v-for="activity in recentActivities"
                :key="activity.id"
                class="activity-item"
              >
                <template #prepend>
                  <VAvatar size="32" :color="activity.color" variant="tonal">
                    <VIcon :icon="activity.icon" size="16" />
                  </VAvatar>
                </template>

                <VListItemTitle class="activity-title">
                  {{ activity.title }}
                </VListItemTitle>
                <VListItemSubtitle class="activity-description">
                  {{ activity.description }}
                </VListItemSubtitle>

                <template #append>
                  <span class="activity-time">
                    {{ formatRelativeTime(activity.timestamp) }}
                  </span>
                </template>
              </VListItem>
            </VList>
          </VCardText>
        </VCard>
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

              <VCol cols="12">
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
  totalClasses: 0,
  totalStudents: 0,
  totalSubjects: 0,
});
const myClasses = ref([]);
const recentActivities = ref([]);
const profileForm = ref({
  name: "",
  email: "",
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

const fetchDashboardData = async () => {
  loading.value = true;

  try {
    await Promise.all([
      fetchStatistics(),
      fetchMyClasses(),
      fetchRecentActivities(),
    ]);
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

const fetchRecentActivities = async () => {
  // Replace with actual API call
  recentActivities.value = [
    {
      id: 1,
      title: "Nilai tugas diperbarui",
      description: "Matematika - XI IPA 1",
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      icon: "tabler-edit",
      color: "primary",
    },
    {
      id: 2,
      title: "Absensi dicatat",
      description: "Fisika - XI IPA 1",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      icon: "tabler-check",
      color: "success",
    },
    {
      id: 3,
      title: "Tugas baru dibuat",
      description: "Matematika - XI IPA 2",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      icon: "tabler-plus",
      color: "info",
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
.teacher-dashboard {
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
    rgba(var(--v-theme-success), 0.1) 0%,
    rgba(var(--v-theme-success), 0.05) 100%
  );
  border-radius: 16px;
  border: 1px solid rgba(var(--v-theme-success), 0.12);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  padding: 16px;
  background: rgba(var(--v-theme-success), 0.1);
  border-radius: 12px;
}

.profile-card {
  position: sticky;
  top: 24px;
}

.stats-grid {
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

.classes-card {
  height: fit-content;
}

.class-item-card {
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
}

.class-stats {
  margin-top: 12px;
}

.activity-item {
  border-radius: 8px;
  margin-bottom: 8px;

  &:hover {
    background: rgba(var(--v-theme-surface), 0.5);
  }
}

.activity-title {
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}

.activity-description {
  color: rgb(var(--v-theme-on-surface-variant));
}

.activity-time {
  color: rgb(var(--v-theme-on-surface-variant));
  font-size: 0.75rem;
}

@media (max-width: 768px) {
  .teacher-dashboard {
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
