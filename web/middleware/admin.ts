import { defineNuxtRouteMiddleware } from "#app";
import { useAuthStore } from "~/stores/auth";
import { createError } from "#app";

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated || authStore.user?.role !== "ADMIN") {
    throw createError({
      statusCode: 403,
      statusMessage: "Access denied. Admin role required.",
    });
  }
});
