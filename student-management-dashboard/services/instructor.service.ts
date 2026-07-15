import { api } from './api'
import type { PaginatedResponse, User } from '~/types'

export const instructorService = {
  async getAll(): Promise<User[]> {
    const response = await api.get<PaginatedResponse<User>>('/users', {
      params: { role: 'teacher' },
    })
    return response.content ?? response.data ?? []
  },
}
