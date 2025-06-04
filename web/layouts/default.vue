<template>
  <SidebarProvider>
    <LayoutAppSidebar />
    <SidebarInset>
      <LayoutHeader />
      <div class="min-w-0 w-full flex-1 overflow-x-auto p-4 lg:p-6">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const route = useRoute();

const pageTitle = computed(() => {
  const path = route.path;
  if (path === "/dashboard") return "Dashboard";
  if (path.startsWith("/users")) return "Users";
  if (path.startsWith("/classes")) return "Classes";
  if (path.startsWith("/subjects")) return "Subjects";
  if (path.startsWith("/assessment-weights")) return "Assessment Weights";
  return "TA SILAP TIH";
});
</script>

<style scoped></style>
