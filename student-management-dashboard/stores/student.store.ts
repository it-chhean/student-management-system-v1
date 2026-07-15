import { defineStore } from 'pinia'
import type { Student, StudentStats } from '~/types'
import { studentService } from '~/services/student.service'

interface StudentQueryParams {
  page: number
  pageSize: number
  search?: string
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
  status?: boolean
  classId?: string
  departmentId?: string
}

interface PaginationMeta {
  currentPage: number
  pageSize: number
  totalElements: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

interface StudentState {
  students: Student[]
  selectedStudent: Student | null
  stats: StudentStats | null

  pagination: PaginationMeta

  query: StudentQueryParams

  selectedIds: number[]
  loading: boolean
  tableLoading: boolean
  error: string | null
}

export const useStudentStore = defineStore('students', {
  state: (): StudentState => ({
    students: [],
    selectedStudent: null,
    stats: null,

    pagination: {
      currentPage: 1,
      pageSize: 10,
      totalElements: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
    },

    query: {
      page: 1,
      pageSize: 10,
      sortBy: 'enFirstName',
      sortDirection: 'asc',
    },

    selectedIds: [],
    loading: false,
    tableLoading: false,
    error: null,
  }),

  getters: {
    isAllSelected(): boolean {
      if (this.students.length === 0) return false
      return this.students.every((student) => this.selectedIds.includes(student.id))
    },

    isSomeSelected(): boolean {
      return this.selectedIds.length > 0 && !this.isAllSelected
    },
  },

  actions: {
    buildQueryParams(): StudentQueryParams {
      return {
        page: this.query.page,
        pageSize: this.query.pageSize,
        search: this.query.search && this.query.search.trim() ? this.query.search : undefined,
        sortBy: this.query.sortBy,
        sortDirection: this.query.sortDirection,
        status: this.query.status !== undefined ? this.query.status : undefined,
        classId: this.query.classId,
        departmentId: this.query.departmentId,
      }
    },

    updatePaginationFromResponse(response: any): void {
      this.pagination = {
        currentPage: response.number || response.page || 1,
        pageSize: response.size || response.pageSize || 10,
        totalElements: response.totalElement || response.total || 0,
        totalPages: response.totalPage || response.totalPages || 0,
        hasNext: response.hastNext ?? false,
        hasPrevious: response.hastPrevious ?? false,
      }
    },

    async fetchStudents(): Promise<void> {
      this.tableLoading = true
      this.error = null

      try {
        const params = this.buildQueryParams()
        const response = await studentService.getAll(params)

        if (response.success && response.content) {
          this.students = response.content
          this.updatePaginationFromResponse(response)
          this.clearSelection() // Clear selection on new fetch
        }
      } catch (err: any) {
        this.error = err?.message ?? 'Failed to load students'
        console.error('Failed to fetch students:', err)
      } finally {
        this.tableLoading = false
      }
    },

    async fetchStats(): Promise<void> {
      this.loading = true

      try {
        const response = await studentService.getStatistics()
        this.stats = response?.data ?? null
      } catch (err: any) {
        console.error('Failed to fetch stats:', err)
      } finally {
        this.loading = false
      }
    },

    async fetchById(id: string | number): Promise<Student | null> {
      this.loading = true
      this.error = null

      try {
        const response = await studentService.getById(Number(id))
        this.selectedStudent = response?.data ?? null
        return this.selectedStudent
      } catch (err: any) {
        this.error = err?.message ?? 'Failed to load student'
        return null
      } finally {
        this.loading = false
      }
    },

    async createStudent(data: Partial<Student>): Promise<Student | null> {
      this.loading = true
      this.error = null

      try {
        const response = await studentService.create(data)

        if (response?.data) {
          this.query.page = 1
          await this.fetchStudents()
          return response.data
        }

        return null
      } catch (err: any) {
        this.error = err?.message ?? 'Failed to create student'
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateStudent(id: number, data: Partial<Student>): Promise<Student | null> {
      this.loading = true
      this.error = null

      try {
        const response = await studentService.update(id, data)

        if (response?.data) {
          const index = this.students.findIndex((s) => s.id === id)
          if (index !== -1) {
            this.students[index] = response.data
          }

          if (this.selectedStudent?.id === id) {
            this.selectedStudent = response.data
          }

          return response.data
        }

        return null
      } catch (err: any) {
        this.error = err?.message ?? 'Failed to update student'
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteStudent(id: number): Promise<void> {
      this.loading = true
      this.error = null

      try {
        await studentService.remove(id)

        this.students = this.students.filter((s) => s.id !== id)
        this.selectedIds = this.selectedIds.filter((sid) => sid !== id)

        if (this.selectedStudent?.id === id) {
          this.selectedStudent = null
        }
      } catch (err: any) {
        this.error = err?.message ?? 'Failed to delete student'
        throw err
      } finally {
        this.loading = false
      }
    },

    async bulkDelete(ids: number[]): Promise<void> {
      this.loading = true
      this.error = null

      try {
        await studentService.bulkDelete(ids)

        this.students = this.students.filter((s) => !ids.includes(s.id))
        this.selectedIds = []

        if (this.selectedStudent && ids.includes(this.selectedStudent.id)) {
          this.selectedStudent = null
        }
      } catch (err: any) {
        this.error = err?.message ?? 'Failed to delete students'
        throw err
      } finally {
        this.loading = false
      }
    },

    async importStudents(classId: number, file: File): Promise<boolean> {
      this.loading = true
      this.error = null

      try {
        await studentService.importStudents(classId, file)

        this.query.page = 1
        await this.fetchStudents()
        return true
      } catch (err: any) {
        this.error = err?.message ?? 'Failed to import students'
        throw err
      } finally {
        this.loading = false
      }
    },

    async exportStudents(classId: number): Promise<void> {
      try {
        await studentService.exportStudents(classId)
      } catch (err: any) {
        this.error = err?.message ?? 'Failed to export students'
        console.error('Failed to export students:', err)
      }
    },

    setSearch(query: string): void {
      this.query.search = query
      this.query.page = 1 // Reset to first page
      this.fetchStudents()
    },

    setFilter(
      key: 'status' | 'classId' | 'departmentId',
      value: string | boolean | undefined
    ): void {
      if (value === '' || value === undefined) {
        this.query[key] = undefined
      } else {
        this.query[key] = value as any
      }
      this.query.page = 1 // Reset to first page
      this.fetchStudents()
    },

    clearFilters(): void {
      this.query.search = undefined
      this.query.status = undefined
      this.query.classId = undefined
      this.query.departmentId = undefined
      this.query.page = 1
      this.fetchStudents()
    },

    setSort(sortBy: string): void {
      if (this.query.sortBy === sortBy) {
        this.query.sortDirection = this.query.sortDirection === 'asc' ? 'desc' : 'asc'
      } else {
        this.query.sortBy = sortBy
        this.query.sortDirection = 'asc'
      }
      this.query.page = 1
      this.fetchStudents()
    },

    setPage(page: number): void {
      this.query.page = Math.max(1, page)
      this.fetchStudents()
    },

    setPageSize(pageSize: number): void {
      this.query.pageSize = pageSize
      this.query.page = 1
      this.fetchStudents()
    },

    toggleSelect(id: number): void {
      const index = this.selectedIds.indexOf(id)
      if (index === -1) {
        this.selectedIds.push(id)
      } else {
        this.selectedIds.splice(index, 1)
      }
    },

    toggleSelectAll(): void {
      if (this.isAllSelected) {
        const pageIds = new Set(this.students.map((s) => s.id))
        this.selectedIds = this.selectedIds.filter((id) => !pageIds.has(id))
      } else {
        this.students.forEach((student) => {
          if (!this.selectedIds.includes(student.id)) {
            this.selectedIds.push(student.id)
          }
        })
      }
    },

    clearSelection(): void {
      this.selectedIds = []
    },

    clearError(): void {
      this.error = null
    },
  },
})