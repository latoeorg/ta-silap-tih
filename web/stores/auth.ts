import { defineStore } from "pinia";
import type { User } from "~/types";
import { useApi } from "~/composables/useApi";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
  }),

  actions: {
    async login(email: string, password: string) {
      this.loading = true;
      const { api } = useApi();

      try {
        const response: any = await api("/login", {
          method: "POST",
          body: { email, password },
        });

        const data = response.data as { token: string; user: User };
        this.token = data.token;
        this.user = data.user;
        this.isAuthenticated = true;

        // Store token in localStorage
        if (import.meta.client) {
          localStorage.setItem("token", this.token!);
        }

        return response;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async register(userData: {
      email: string;
      password: string;
      name: string;
      role: "TEACHER" | "STUDENT";
    }) {
      this.loading = true;
      const { api } = useApi();

      try {
        const response = await api("/register", {
          method: "POST",
          body: userData,
        });

        const data = response.data as { token: string; user: User };
        this.token = data.token;
        this.user = data.user;
        this.isAuthenticated = true;

        // Store token in localStorage
        if (import.meta.client) {
          localStorage.setItem("token", this.token!);
        }

        return response;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getProfile() {
      this.loading = true;
      const { api } = useApi();

      try {
        const response = await api("/profile");
        this.user = response.data as User;
        return response;
      } catch (error) {
        this.logout();
        throw error;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;

      if (import.meta.client) {
        localStorage.removeItem("token");
      }

      navigateTo("/login");
    },

    async initializeAuth() {
      if (import.meta.client) {
        const token = localStorage.getItem("token");
        if (token) {
          this.token = token;
          try {
            await this.getProfile();
            this.isAuthenticated = true;
          } catch (error) {
            this.logout();
          }
        }
      }
    },
  },
});
