import { api } from './api'
import type { ApiResponse, Course, PaginatedResponse } from '~/types'

export interface CourseScheduleFormData {
  dayOfWeek: string
  startTime: string
  endTime: string
  room: number
}

export interface CourseFormData {
  subjectId: string
  semesterId: string
  instructorId: string
  name: string
  description: string
  schedule?: string
  schedules: CourseScheduleFormData[]
  startAt: string
  endAt: string
}

export const courseService = {
  async getAll(): Promise<Course[]> {
    const response = await api.get<PaginatedResponse<Course>>('/courses')
    return response.content
  },

  async create(data: CourseFormData): Promise<Course> {
    const response = await api.post<ApiResponse<Course>>('/courses', data)
    return response.data
  },

  async update(id: string, data: CourseFormData): Promise<Course> {
    const response = await api.put<ApiResponse<Course>>(`/courses/${id}`, data)
    return response.data
  },
}
