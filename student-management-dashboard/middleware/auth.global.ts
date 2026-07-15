export default defineNuxtRouteMiddleware(async (to) => {
  console.log("Auth middleware triggered for: ", to.fullPath)
  const auth = useAuthStore()

  const publicRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/403',
  ]
  
  if (publicRoutes.includes(to.path)) {
    console.log("Route is public, allowing access")
    return
  }

  if (!auth.isAuthenticated) {
    console.log("User not authenticated, checking with backend...")
    await auth.checkAuth()
  }

  if (!auth.isAuthenticated) {
    console.log("Authentication failed, redirecting to login")
    return navigateTo('/auth/login')
  }

  const requiredRoles = to.meta?.roles as string[] | undefined

  if (requiredRoles && requiredRoles.length > 0) {
    const userRole = auth.user?.role ?? ''
    const hasAccess = requiredRoles.includes(userRole)
    console.log("Role check - Required:", requiredRoles, "User role:", userRole, "Has access:", hasAccess)

    if (!hasAccess) {
      console.log("User lacks required role, redirecting to 403")
      return navigateTo('/403')
    }
  }
})