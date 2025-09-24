<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <div class="header-content">
        <VIcon
          icon="tabler-dashboard"
          size="48"
          color="primary"
          class="header-icon"
        />
        <div>
          <h1 class="text-h4 font-weight-bold text-primary">
            Dashboard Administrator
          </h1>
          <p class="text-body-1 text-medium-emphasis">
            Kelola seluruh sistem dan pantau aktivitas
          </p>
        </div>
      </div>
      <div class="header-actions">
        <VChip
          color="primary"
          variant="tonal"
          prepend-icon="tabler-crown"
        >
          Administrator
        </VChip>
      </div>
    </div>

    <!-- Statistics Cards -->
    <VRow class="stats-row">
      <VCol
        cols="12"
        sm="6"
        md="3"
      >
        <VCard class="stat-card">
          <VCardText>
            <div class="stat-content">
              <div class="stat-icon-wrapper primary">
                <VIcon
                  icon="tabler-users"
                  size="32"
                  color="white"
                />
              </div>
              <div class="stat-info">
                <h3 class="stat-number">
                  {{ loading ? "..." : statistics.totalUsers || 0 }}
                </h3>
                <p class="stat-label">
                  Total Pengguna
                </p>
              </div>
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
          <VCardText>
            <div class="stat-content">
              <div class="stat-icon-wrapper success">
                <VIcon
                  icon="tabler-school"
                  size="32"
                  color="white"
                />
              </div>
              <div class="stat-info">
                <h3 class="stat-number">
                  {{ loading ? "..." : statistics.totalClasses || 0 }}
                </h3>
                <p class="stat-label">
                  Total Kelas
                </p>
              </div>
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
          <VCardText>
            <div class="stat-content">
              <div class="stat-icon-wrapper info">
                <VIcon
                  icon="tabler-book"
                  size="32"
                  color="white"
                />
              </div>
              <div class="stat-info">
                <h3 class="stat-number">
                  {{ loading ? "..." : statistics.totalSubjects || 0 }}
                </h3>
                <p class="stat-label">
                  Mata Pelajaran
                </p>
              </div>
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
          <VCardText>
            <div class="stat-content">
              <div class="stat-icon-wrapper warning">
                <VIcon
                  icon="tabler-clipboard-list"
                  size="32"
                  color="white"
                />
              </div>
              <div class="stat-info">
                <h3 class="stat-number">
                  {{ loading ? "..." : statistics.totalCourses || 0 }}
                </h3>
                <p class="stat-label">
                  Total Kursus
                </p>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <VRow>
      <!-- System Activity -->
      <VCol
        cols="12"
        md="8"
      >
        <VCard class="activity-card">
          <VCardTitle class="d-flex align-center">
            <VIcon
              icon="tabler-activity"
              class="me-2"
              color="primary"
            />
            Aktivitas Sistem Terbaru
          </VCardTitle>

          <VDivider />

          <VCardText>
            <div
              v-if="loading"
              class="text-center py-8"
            >
              <VProgressCircular
                indeterminate
                size="32"
                color="primary"
              />
              <p class="text-body-2 mt-2">
                Memuat aktivitas...
              </p>
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
              <p class="text-body-2 text-disabled">
                Belum ada aktivitas
              </p>
            </div>

            <VTimeline
              v-else
              density="compact"
              align="start"
            >
              <VTimelineItem
                v-for="activity in recentActivities"
                :key="activity.id"
                :dot-color="activity.color"
                size="small"
              >
                <template #icon>
                  <VIcon
                    :icon="activity.icon"
                    size="16"
                  />
                </template>

                <div class="activity-item">
                  <h6 class="activity-title">
                    {{ activity.title }}
                  </h6>
                  <p class="activity-description">
                    {{ activity.description }}
                  </p>
                  <span class="activity-time">{{
                    formatRelativeTime(activity.timestamp)
                  }}</span>
                </div>
              </VTimelineItem>
            </VTimeline>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Quick Actions -->
      <VCol
        cols="12"
        md="4"
      >
        <VCard class="quick-actions-card">
          <VCardTitle class="d-flex align-center">
            <VIcon
              icon="tabler-bolt"
              class="me-2"
              color="primary"
            />
            Aksi Cepat
          </VCardTitle>

          <VDivider />

          <VCardText>
            <div class="quick-actions">
              <VBtn
                block
                variant="outlined"
                color="primary"
                prepend-icon="tabler-user-plus"
                class="mb-3"
                to="/user"
              >
                Tambah Pengguna
              </VBtn>

              <VBtn
                block
                variant="outlined"
                color="success"
                prepend-icon="tabler-school"
                class="mb-3"
                to="/class"
              >
                Kelola Kelas
              </VBtn>

              <VBtn
                block
                variant="outlined"
                color="info"
                prepend-icon="tabler-book"
                class="mb-3"
                to="/subject"
              >
                Kelola Mata Pelajaran
              </VBtn>
            </div>
          </VCardText>
        </VCard>

        <!-- System Health -->
        <VCard class="mt-4">
          <VCardTitle class="d-flex align-center">
            <VIcon
              icon="tabler-heartbeat"
              class="me-2"
              color="success"
            />
            Status Sistem
          </VCardTitle>

          <VDivider />

          <VCardText>
            <div class="system-health">
              <div class="health-item">
                <div class="d-flex align-center justify-space-between mb-2">
                  <span class="text-body-2">Database</span>
                  <VChip
                    size="small"
                    color="success"
                    variant="tonal"
                  >
                    Online
                  </VChip>
                </div>
              </div>

              <div class="health-item">
                <div class="d-flex align-center justify-space-between mb-2">
                  <span class="text-body-2">Server</span>
                  <VChip
                    size="small"
                    color="success"
                    variant="tonal"
                  >
                    Normal
                  </VChip>
                </div>
              </div>

              <div class="health-item">
                <div class="d-flex align-center justify-space-between">
                  <span class="text-body-2">Pengguna Aktif</span>
                  <VChip
                    size="small"
                    color="primary"
                    variant="tonal"
                  >
                    {{ statistics.activeUsers || 0 }}
                  </VChip>
                </div>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<script setup>
import { formatRelativeTime } from "@/utils/formatters"

const store = useVuex()

// State
const loading = ref(true)

const statistics = ref({
  totalUsers: 0,
  totalClasses: 0,
  totalSubjects: 0,
  totalCourses: 0,
  activeUsers: 0,
})

const recentActivities = ref([])

// Fetch dashboard data
const fetchDashboardData = async () => {
  loading.value = true

  try {
    // Simulate API calls - replace with actual API endpoints
    await Promise.all([fetchStatistics(), fetchRecentActivities()])
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error)
  } finally {
    loading.value = false
  }
}

const fetchStatistics = async () => {
  // Replace with actual API call
  statistics.value = {
    totalUsers: 150,
    totalClasses: 25,
    totalSubjects: 12,
    totalCourses: 45,
    activeUsers: 23,
  }
}

const fetchRecentActivities = async () => {
  // Replace with actual API call
  recentActivities.value = [
    {
      id: 1,
      title: "Pengguna baru terdaftar",
      description: "John Doe mendaftar sebagai siswa",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      icon: "tabler-user-plus",
    },
    {
      id: 2,
      title: "Kelas baru dibuat",
      description: "Kelas XII IPA 1 telah dibuat",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      icon: "tabler-school",
    },
    {
      id: 3,
      title: "Mata pelajaran diperbarui",
      description: "Matematika - jadwal diperbarui",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      icon: "tabler-book",
    },
    {
      id: 4,
      title: "Backup sistem",
      description: "Backup otomatis berhasil dilakukan",
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      icon: "tabler-database",
    },
  ]
}

// Mount
onMounted(() => {
  fetchDashboardData()
})
</script>

<style lang="scss" scoped>
.admin-dashboard {
  padding: 24px;
}

.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border: 1px solid rgba(var(--v-theme-primary), 0.12);
  border-radius: 16px;
  margin-block-end: 32px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  padding: 16px;
  border-radius: 12px;
}

.stats-row {
  margin-block-end: 24px;
}

.stat-card {
  block-size: 100%;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 12%);
    transform: translateY(-2px);
  }
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border-radius: 12px;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  margin-block-end: 4px;
}

.stat-label {
  margin: 0;
  font-size: 0.875rem;
}

.activity-card,
.quick-actions-card {
  block-size: fit-content;
}

.activity-item {
  padding-inline-start: 8px;
}

.activity-title {
  font-weight: 600;
  margin-block-end: 4px;
}

.activity-description {
  font-size: 0.875rem;
  margin-block-end: 8px;
}

.activity-time {
  font-size: 0.75rem;
}

.quick-actions {
  display: flex;
  flex-direction: column;
}

.system-health {
  .health-item {
    padding-block: 8px;
    padding-inline: 0;

    &:not(:last-child) {
      border-block-end: 1px solid rgba(var(--v-border-color), 0.12);
    }
  }
}

@media (max-width: 768px) {
  .admin-dashboard {
    padding: 16px;
  }

  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .header-actions {
    align-self: stretch;
  }
}
</style>
