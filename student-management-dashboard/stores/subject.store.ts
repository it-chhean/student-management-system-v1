import { defineStore } from 'pinia'
import type { Subject } from '~/types'
import { subjectService } from '~/services/subject.service'

interface SubjectState {
  subjects: Subject[]
  loading: boolean
  error: string | null
}

export const useSubjectStore = defineStore('subjects', {
  state: (): SubjectState => ({
    subjects: [],
    loading: false,
    error: null,
  }),

  getters: {
    getSubjectsByDepartment: (state) => (departmentId: string) => {
      return state.subjects.filter(s => s.departmentId === departmentId)
    },
    getSubjectCountByDepartment: (state) => (departmentId: string) => {
      return state.subjects.filter(s => s.departmentId === departmentId).length
    }
  },

  actions: {
    async fetchSubjects() {
      this.loading = true
      this.error = null
      try {
        const response = await subjectService.getAll()
        this.subjects = response
      } catch (e: any) {
        this.error = e.message || 'Failed to load subjects'
      } finally {
        this.loading = false
      }
    }
  }
})
