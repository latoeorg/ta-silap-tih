import { defineNuxtRouteMiddleware } from "#app";
import { useAuthStore } from "~/stores/auth";
import { navigateTo } from "#app";

export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore();

  await nextTick(); // Wait for hydration
  console.log("Guest middleware triggered", authStore.isAuthenticated);

  if (authStore.isAuthenticated) {
    return navigateTo("/");
  }
});
