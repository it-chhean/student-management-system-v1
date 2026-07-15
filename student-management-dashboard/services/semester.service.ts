import { api } from './api'
import type { ApiResponse, Semester } from '~/types'

export interface SemesterFormData {
  name: string
  startDate: string
  endDate: string
  description: string
}

export const semesterService = {
  async getAll(): Promise<Semester[]> {
    const response = await api.get<any>('/semesters')
    return response.data || response.content || [];
  },

  async create(data: SemesterFormData): Promise<Semester> {
    const response = await api.post<ApiResponse<Semester>>('/semesters', data)
    return response.data;
  },

  async update(id: string, data: SemesterFormData): Promise<Semester> {
    const response = await api.put<ApiResponse<Semester>>(`/semesters/${id}`, data)
    return response.data;
  },
}