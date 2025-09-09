<template>
  <div>
    <!-- Admin Dashboard -->
    <AdminDashboard v-if="userRole === 'ADMIN'" />

    <!-- Teacher Dashboard -->
    <TeacherDashboard v-else-if="userRole === 'TEACHER'" />

    <!-- Student Dashboard -->
    <StudentDashboard v-else-if="userRole === 'STUDENT'" />

    <!-- Fallback for unknown roles -->
    <VCard v-else>
      <VCardText class="text-center py-12">
        <VIcon
          icon="tabler-user-question"
          size="64"
          color="disabled"
          class="mb-4"
        />
        <h2 class="text-h5 mb-2">
          Role tidak dikenali
        </h2>
        <p class="text-body-1 text-medium-emphasis">
          Silakan hubungi administrator untuk mengatur role Anda.
        </p>
      </VCardText>
    </VCard>
  </div>
</template>

<script setup>
import AdminDashboard from "@/components/dashboard/admin-dashboard.vue"
import StudentDashboard from "@/components/dashboard/student-dashboard.vue"
import TeacherDashboard from "@/components/dashboard/teacher-dashboard.vue"

const store = useVuex()

// Get user role from store
const userRole = computed(() => store.state.app.user?.role)

// Redirect to login if not authenticated
onMounted(() => {
  if (!store.state.app.user) {
    navigateTo("/login")
  }
})
</script>
