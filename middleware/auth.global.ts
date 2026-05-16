const PUBLIC_ROUTES = ['/']

export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()

  if (!PUBLIC_ROUTES.includes(to.path) && !isAuthenticated.value) {
    return navigateTo('/')
  }
})
