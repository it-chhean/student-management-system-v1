import { api } from './api'
import type { AuditLog } from '~/types'

export const auditService = {
  async getAll(): Promise<AuditLog[]> {
    const response = await api.get<AuditLog[]>('/audit')
    return response;
  },

  async getById(id: number): Promise<AuditLog> {
    return await api.get<AuditLog>(`/audit/${id}`)
  }
}
