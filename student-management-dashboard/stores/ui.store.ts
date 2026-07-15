import { defineStore } from 'pinia'
import type { ToastMessage, ModalOptions } from '~/types'

interface UiState {
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  toasts: ToastMessage[]
  modal: {
    visible: boolean
    options: ModalOptions | null
    loading: boolean
  }
  globalSearchQuery: string
  globalSearchVisible: boolean
}

export const useUiStore = defineStore('ui', {
  state: (): UiState => ({
    sidebarOpen: true,
    sidebarCollapsed: false,
    toasts: [],
    modal: {
      visible: false,
      options: null,
      loading: false,
    },
    globalSearchQuery: '',
    globalSearchVisible: false,
  }),

  getters: {
    unreadToasts: (state) => state.toasts.filter(t => !t.duration || t.duration > 0),
  },

  actions: {
    // sidebar 
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },

    setSidebarOpen(open: boolean) {
      this.sidebarOpen = open
    },

    toggleSidebarCollapse() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },

    // Toast 
    addToast(toast: Omit<ToastMessage, 'id'>) {
      const id = Math.random().toString(36).substring(2, 9)
      const newToast: ToastMessage = { id, duration: 4000, ...toast }
      this.toasts.push(newToast)

      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => this.removeToast(id), newToast.duration)
      }

      return id
    },

    removeToast(id: string) {
      const index = this.toasts.findIndex(t => t.id === id)
      if (index !== -1) this.toasts.splice(index, 1)
    },

    clearToasts() {
      this.toasts = []
    },

    // Convenience toast methods
    success(title: string, message?: string) {
      return this.addToast({ type: 'success', title, message })
    },

    error(title: string, message?: string) {
      return this.addToast({ type: 'error', title, message, duration: 6000 })
    },

    warning(title: string, message?: string) {
      return this.addToast({ type: 'warning', title, message })
    },

    info(title: string, message?: string) {
      return this.addToast({ type: 'info', title, message })
    },

    // model
    openModal(options: ModalOptions) {
      this.modal.options = options
      this.modal.visible = true
      this.modal.loading = false
    },

    closeModal() {
      this.modal.visible = false
      this.modal.loading = false
      setTimeout(() => { this.modal.options = null }, 300)
    },

    async confirmModal() {
      if (!this.modal.options?.onConfirm) return this.closeModal()
      this.modal.loading = true
      try {
        await this.modal.options.onConfirm()
        this.closeModal()
      } catch (err) {
        console.error('Modal confirm error:', err)
        this.modal.loading = false
      }
    },

    // Global search
    openGlobalSearch() {
      this.globalSearchVisible = true
    },

    closeGlobalSearch() {
      this.globalSearchVisible = false
      this.globalSearchQuery = ''
    },

    setGlobalSearchQuery(query: string) {
      this.globalSearchQuery = query
    },
  },
})