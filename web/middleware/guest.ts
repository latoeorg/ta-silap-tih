import { defineNuxtRouteMiddleware } from "#app";
import { useAuthStore } from "~/stores/auth";
import { navigateTo } from "#app";

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore();

  if (authStore.isAuthenticated) {
    return navigateTo("/dashboard");
  }
});
