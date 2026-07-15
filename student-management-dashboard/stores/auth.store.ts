import { defineStore } from "pinia";
import { authService } from "~/services/auth.service";

import type {
  AuthUser,
  LoginCredentials,
  RegisterData,
} from "~/types";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  }),

  getters: {
    role: (state): string => state.user?.role ?? "",

    isAdmin: (state): boolean => state.user?.role === "ROLE_ADMIN",

    isStaff: (state): boolean => ["ROLE_ADMIN", "ROLE_STAFF"].includes(state.user?.role ?? "",),

    userName: (state): string => state.user?.fullName ?? "Guest",

    userEmail: (state): string => state.user?.email ?? "",
  },

  actions: {
    hasRole(role: string): boolean {
      return this.user?.role === role
    },

    hasAnyRole(roles: string[]): boolean {
      return roles.includes(this.user?.role ?? "")
    },

    async signin(credentials: LoginCredentials) {
      this.loading = true;
      this.error = null;

      try {
        await authService.signin(credentials)
        await this.fetchProfile()
        this.isAuthenticated = true

        return true;
      } catch (err: any) {
        this.error = err.message ?? "Login failed"
        return false
      } finally {
        this.loading = false
      }
    },

    async register(data: RegisterData) {
      this.loading = true;
      this.error = null;

      try {
        await authService.signup(data)

        return true;
      } catch (err: any) {
        this.error = err.message ?? "Registration failed"

        return false
      } finally {
        this.loading = false
      }
    },

    async fetchProfile() {
      try {
        const response = await authService.profile();

        this.user = response.data;
        this.isAuthenticated = true;
      } catch (error: any) {
        console.error("Error fetching profile:", error.message);
        
        this.user = null;
        this.isAuthenticated = false;
      }
    },

    async checkAuth() {
      try {
        const response = await authService.isAuthenticated()
        if (response.data) {
          await this.fetchProfile();
        } else {
          this.user = null;
        }
      } catch (error: any) {
        console.error("Error checking authentication:", error.message);
        this.user = null;
        this.isAuthenticated = false;
      }
    },

    async logout() {
      this.loading = true;

      try {
        await authService.logout();
      } catch (error: any) {
        console.error("Error logging out:", error.message);
      } finally {
        this.user = null;
        this.isAuthenticated = false;
        this.loading = false;

        await navigateTo("/auth/login");
      }
    },

    clearError() {
      this.error = null;
    },
  },
});