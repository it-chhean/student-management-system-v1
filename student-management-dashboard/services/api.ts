import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import type { ApiResponse, PaginatedResponse, ApiError } from '~/types'

// Axios Instance
class ApiService {
  private instance: AxiosInstance
  private refreshing = false
  private BASE_URL = "http://localhost:8080/api/v1"

  constructor() {
    this.instance = axios.create({
      baseURL: this.BASE_URL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      withCredentials: true
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    // Request interceptor — attach JWT token
    this.instance.interceptors.request.use(
      (config) => {
        const token = this.getToken()
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor — handle errors
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          if (!this.refreshing) {
            this.refreshing = true
            try {
              await this.refreshToken()
              this.refreshing = false
              return this.instance(originalRequest)
            } catch {
              this.refreshing = false
              this.clearTokens()
              window.location.href = '/auth/login'
              return Promise.reject(error)
            }
          }
        }

        return Promise.reject(this.normalizeError(error))
      }
    )
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('access_token')
  }

  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('refresh_token')
  }

  private clearTokens(): void {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  private async refreshToken(): Promise<void> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) throw new Error('No refresh token')

    const response = await this.instance.post<ApiResponse<{ accessToken: string }>>('/auth/refresh', {
      refreshToken,
    })

    localStorage.setItem('access_token', response.data.data.accessToken)
  }

  private normalizeError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
      return {
        message: error.response?.data?.message ?? error.message ?? 'An error occurred',
        code: error.response?.data?.code,
        errors: error.response?.data?.errors,
        status: error.response?.status,
      }
    }
    return { message: 'An unexpected error occurred' }
  }

  // HTTP Methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.get(url, config)
    return response.data
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.post(url, data, config)
    return response.data
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.put(url, data, config)
    return response.data
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.patch(url, data, config)
    return response.data
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.delete(url, config)
    return response.data
  }

  async uploadFile<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)

    const response: AxiosResponse<T> = await this.instance.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    })

    return response.data
  }

  // Set auth tokens (called after login)
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('refresh_token', refreshToken)
  }

  // Clear auth tokens (called after logout)
  removeTokens(): void {
    this.clearTokens()
  }
}

// Singleton Export
export const api = new ApiService()

// Generic CRUD Builder
export function createCrudService<T, CreateDTO = Partial<T>, UpdateDTO = Partial<T>>(
  basePath: string
) {
  return {
    async getAll(params?: Record<string, any>): Promise<PaginatedResponse<T>> {
      return api.get<PaginatedResponse<T>>(basePath, { params })
    },

    async getById(id: number): Promise<ApiResponse<T>> {
      return api.get<ApiResponse<T>>(`${basePath}/${id}`)
    },

    async create(data: CreateDTO): Promise<ApiResponse<T>> {
      return api.post<ApiResponse<T>>(basePath, data)
    },

    async update(id: number, data: UpdateDTO): Promise<ApiResponse<T>> {
      return api.put<ApiResponse<T>>(`${basePath}/${id}`, data)
    },

    async patch(id: number, data: Partial<UpdateDTO>): Promise<ApiResponse<T>> {
      return api.patch<ApiResponse<T>>(`${basePath}/${id}`, data)
    },

    async remove(id: number): Promise<ApiResponse<void>> {
      return api.delete<ApiResponse<void>>(`${basePath}/${id}`)
    },

    async bulkDelete(ids: number[]): Promise<ApiResponse<void>> {
      return api.post<ApiResponse<void>>(`${basePath}/bulk-delete`, { ids })
    },
  }
}
