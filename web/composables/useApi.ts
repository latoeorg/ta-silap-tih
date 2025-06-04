import { useRuntimeConfig } from "#app";
import { $fetch } from "ofetch";
import { toast } from "vue-sonner";
import type { ApiResponse } from "~/types";

export const useApi = () => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  const api = async <T>(
    endpoint: string,
    options: {
      method?: "GET" | "POST" | "PUT" | "DELETE";
      body?: any;
      headers?: Record<string, string>;
    } = {}
  ): Promise<ApiResponse<T>> => {
    const { method = "GET", body, headers = {} } = options;

    // Add authorization header if token exists
    if (authStore.token) {
      headers.Authorization = `Bearer ${authStore.token}`;
    }

    try {
      const response = await $fetch<ApiResponse<T>>(
        `${config.public.apiBase}${endpoint}`,
        {
          method,
          body,
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
        }
      );

      return response;
    } catch (error: any) {
      if (error.status === 401) {
        authStore.logout();
        toast.error("Session expired. You have been logged out.");
      } else {
        toast.error(
          error?.data?.message || "Something went wrong. Please try again."
        );
      }
      throw error;
    }
  };

  return { api };
};
