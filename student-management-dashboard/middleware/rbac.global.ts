export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  const { canAny } = usePermission()

  if (!auth.isAuthenticated && to.path !== '/auth/login') {
    return navigateTo('/auth/login')
  }

  const item = findNavItem(to.path)
  
  if (item && item.roles && item.roles.length > 0) {
    if (!canAny(item.roles)) {
      return navigateTo('/403')
    }
  }
})

function findNavItem(path: string) {
  for (const section of NAV_ITEMS) {
    for (const item of section.items) {
      if (item.to === path) return item
      if (item.children) {
        const child = item.children.find(c => c.to === path)
        if (child) return { ...child, roles: item.roles }
      }
    }
  }
  return null
}
