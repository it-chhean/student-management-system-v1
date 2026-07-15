import { defineStore } from 'pinia'
import type { Course } from '~/types'
import { courseService, type CourseFormData } from '~/services/course.service'

interface CourseState {
  courses: Course[]
  loading: boolean
  error: string | null
}

export const useCourseStore = defineStore('courses', {
  state: (): CourseState => ({
    courses: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchCourse() {
      this.loading = true
      this.error = null
      try {
        const response = await courseService.getAll()
        this.courses = response
      } catch (err: any) {
        console.log('Failed to fetch courses:', err.message)
        this.error = 'Failed to load courses'
      } finally {
        this.loading = false
      }
    },

    async createCourse(req: CourseFormData) {
      this.loading = true
      this.error = null

      try {
        const response = await courseService.create(req)
        if(response) {
          this.courses.unshift(response)
        }
      }catch(e: any) {
        console.log("Fails to create course: " , e.message)
        this.error = e.message ?? "Failed to create coruse"
      }finally {
        this.loading = false
      }
    },

    async updateCourse(id: string , req: CourseFormData) {
      this.loading = true
      this.error = null

      try {
        const response = await courseService.update(id , req)
        if(response) {
          const updated = response
          const index = this.courses.findIndex((course) => course.id === id)
          if(index === -1) {
            this.courses[index] = updated
          }
        }
      }catch(e: any) {
        console.log("Failed to update course: " , e.messagee)
        this.error = e.message ?? "Failed to create course"
      }finally {
        this.loading = false
      }

    }

  },
})
