import { api } from './api'
import type { ApiResponse, Department } from '~/types'

export interface DepartmentFormData {
  name: string
  description: string
  thumbnail?: File | null
}

const createFormPayload = (data: DepartmentFormData) => {
  const formData = new FormData()
  formData.append('name', data.name)
  formData.append('description', data.description)
  if (data.thumbnail) {
    formData.append('thumbnail', data.thumbnail)
  }
  return formData
}

export const departmentService = {
  async getAll(): Promise<ApiResponse<Department[]>> {
    const response = await api.get<ApiResponse<Department[]>>('/departments')
    return response;
  },

  async create(data: DepartmentFormData): Promise<ApiResponse<Department>> {
    const payload = createFormPayload(data)
    const response = await api.post<ApiResponse<Department>>('/departments', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response;
  },

  async update(id: number, data: DepartmentFormData): Promise<ApiResponse<Department>> {
    const payload = createFormPayload(data)
    const response = await api.put<ApiResponse<Department>>(`/departments/${id}`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response;
  },
  async getById(id: number): Promise<ApiResponse<Department>> {
    const response = await api.get<ApiResponse<Department>>(`/departments/${id}`)
    return response;
  },
}
