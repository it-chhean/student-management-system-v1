import { api } from './api'
import type { Role } from '~/types'

export const roleService = {
  async getAll() {
    const response = await api.get<any>('/roles')
    return response.content || response.data || []
  },

  async getById(id: string) {
    return await api.get<Role>(`/roles/${id}`)
  },

  async create(data: Partial<Role>) {
    return await api.post<Role>('/roles', data)
  },

  async update(id: string, data: Partial<Role>) {
    return await api.put<Role>(`/roles/${id}`, data)
  },

  async delete(id: string) {
    return await api.delete(`/roles/${id}`)
  }
}
