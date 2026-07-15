import { api, createCrudService } from './api'
import type { Student, ApiResponse, StudentStats } from '~/types'

export interface ImportResult {
  imported: number
  failed: number
  errors?: string[]
}

const crudService = createCrudService<Student>('/students')

export const studentService = {
  ...crudService,

  async getStatistics(): Promise<ApiResponse<StudentStats>> {
    return api.get<ApiResponse<StudentStats>>('/students/statistics')
  },

  async importStudents(classId: number, file: File): Promise<ApiResponse<ImportResult>> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('classId', classId.toString())
    return api.post<ApiResponse<ImportResult>>('/students/import-student', formData , {
      headers: {
        "content-type": "multipart/form-data"
      }
    })
  },

  async exportStudents(classId: number): Promise<Blob> {
    return api.get<Blob>(`/students/export-student/${classId}`, { responseType: 'blob' })
  },

  async uploadAvatar(studentId: number, file: File): Promise<ApiResponse<{ url: number }>> {
    return api.uploadFile<ApiResponse<{ url: number }>>(`/students/${studentId}/avatar`, file)
  },
}

export const downloadStudentExport = (blob: Blob): void => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `students_export_${Date.now()}.xlsx`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
