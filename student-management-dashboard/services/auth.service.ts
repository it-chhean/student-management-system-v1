import { api } from './api'
import axios from 'axios'
import type { ApiResponse, AuthUser, AuthTokens, LoginCredentials, RegisterData, User } from '~/types'

// Auth Service
export const authService = {
  async signin(credentials: LoginCredentials): Promise<ApiResponse<AuthUser>> {
    const response = await api.post<ApiResponse<AuthUser>>(
      '/auth/signin',
      credentials
    )
    const {data} = response;
    api.setTokens(data.verificationToken, data.refreshToken);
    return response;
  },

  async signup(data: RegisterData): Promise<ApiResponse<AuthUser>> {
    return api.post<ApiResponse<AuthUser>>('/auth/signup', data)
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      // Some environments do not expose a logout endpoint; still clear local session.
      if (!axios.isAxiosError(error) || error.response?.status !== 404) {
        throw error
      }
    } finally {
      api.removeTokens()
    }
  },

  async profile(): Promise<ApiResponse<AuthUser>> {
    return api.get<ApiResponse<AuthUser>>('/users/me')
  },

  async isAuthenticated(): Promise<ApiResponse<boolean>> {
    return api.get<ApiResponse<boolean>>("/users/is-authenticated")
  },

  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    return api.post<ApiResponse<void>>('/auth/forgot-password', { email })
  },

  async resetPassword(token: string, password: string): Promise<ApiResponse<void>> {
    return api.post<ApiResponse<void>>('/auth/reset-password', { token, password })
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    return api.post<ApiResponse<void>>('/auth/change-password', { currentPassword, newPassword })
  },

  async updateProfile(data: Partial<AuthUser>): Promise<ApiResponse<AuthUser>> {
    return api.patch<ApiResponse<AuthUser>>('/users/me', data)
  },

  async uploadAvatar(file: File, onProgress?: (p: number) => void): Promise<ApiResponse<{ url: string }>> {
    return api.uploadFile<ApiResponse<{ url: string }>>('/auth/avatar', file, onProgress)
  },
}
