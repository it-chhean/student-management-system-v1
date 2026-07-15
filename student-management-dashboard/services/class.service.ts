import { api } from './api'
import type { ApiResponse, PaginatedResponse, Class } from '~/types'

export interface ClassFormData {
  name: string
  departmentId: number
  academicYear: string
  generation: number
}

export const classService = {
  async getAll(): Promise<PaginatedResponse<Class>> {
    const response = await api.get<PaginatedResponse<Class>>('/classes')
    return response
  },

  async create(data: ClassFormData): Promise<ApiResponse<Class>> {
    const response = await api.post<ApiResponse<Class>>('/classes', data)
    return response
  },

  async update(id: number, data: ClassFormData): Promise<ApiResponse<Class>> {
    const response = await api.put<ApiResponse<Class>>(`/classes/${id}`, data)
    return response
  },
}
