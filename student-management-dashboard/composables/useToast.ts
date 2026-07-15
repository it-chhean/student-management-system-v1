// composables/useToast.ts
export const useToast = () => {
  const ui = useUiStore()
  return {
    success: (title: string, message?: string) => ui.success(title, message),
    error: (title: string, message?: string) => ui.error(title, message),
    warning: (title: string, message?: string) => ui.warning(title, message),
    info: (title: string, message?: string) => ui.info(title, message),
    remove: (id: string) => ui.removeToast(id),
  }
}
