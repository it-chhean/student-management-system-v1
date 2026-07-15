import { api } from './api'
import type { ApiResponse, Subject } from '~/types'

export interface SubjectFormData {
  departmentId: string
  name: string
  description: string
  image?: File | null
}

const createFormPayload = (data: SubjectFormData) => {
  const formData = new FormData()
  formData.append('departmentId', data.departmentId)
  formData.append('name', data.name)
  formData.append('description', data.description)
  if (data.image) {
    formData.append('image', data.image)
  }
  return formData
}

export const subjectService = {
  async getAll(): Promise<Subject[]> {
    const response = await api.get<any>('/subjects')
    return response.data || response.content || [];
  },

  async create(data: SubjectFormData): Promise<Subject> {
    const payload = createFormPayload(data)
    const response = await api.post<ApiResponse<Subject>>('/subjects', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data;
  },

  async update(id: string, data: SubjectFormData): Promise<Subject> {
    const payload = createFormPayload(data)
    const response = await api.put<ApiResponse<Subject>>(`/subjects/${id}`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data;
  },
}
