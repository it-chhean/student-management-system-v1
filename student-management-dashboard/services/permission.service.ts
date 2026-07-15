import { api } from './api'
import type { Permission } from '~/types'

export const permissionService = {
  async getAll() {
    const response = await api.get<any>('/permissions')
    return response.content || response.data || []
  },

  async getById(id: string) {
    return await api.get<Permission>(`/permissions/${id}`)
  },

  async create(data: Partial<Permission>) {
    return await api.post<Permission>('/permissions', data)
  },

  async update(id: string, data: Partial<Permission>) {
    return await api.put<Permission>(`/permissions/${id}`, data)
  },

  async delete(id: string) {
    return await api.delete(`/permissions/${id}`)
  }
}
