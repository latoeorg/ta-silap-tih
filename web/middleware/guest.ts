import { defineNuxtRouteMiddleware } from "#app";
import { useAuthStore } from "~/stores/auth";
import { navigateTo } from "#app";

export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore();

  await nextTick(); // Wait for hydration
  const isLogged = localStorage.getItem("token");

  if (authStore.isAuthenticated || isLogged) {
    return navigateTo("/");
  }
});
