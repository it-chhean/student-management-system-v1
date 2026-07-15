import type { ModalOptions } from '~/types'

export const useModal = () => {
  const ui = useUiStore()

  const confirm = (options: ModalOptions) => {
    return new Promise<boolean>((resolve) => {
      ui.openModal({
        ...options,
        onConfirm: async () => {
          await options.onConfirm?.()
          resolve(true)
        },
        onCancel: () => {
          options.onCancel?.()
          resolve(false)
        },
      })
    })
  }

  const alert = (title: string, message?: string) => {
    return new Promise<void>((resolve) => {
      ui.openModal({
        title,
        message,
        confirmLabel: 'OK',
        cancelLabel: '',
        onConfirm: () => resolve(),
      })
    })
  }

  const danger = (title: string, message?: string, onConfirm?: () => void | Promise<void>) => {
    return confirm({
      title,
      message,
      type: 'danger',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      onConfirm,
    })
  }

  return { confirm, alert, danger, open: ui.openModal, close: ui.closeModal }
}
