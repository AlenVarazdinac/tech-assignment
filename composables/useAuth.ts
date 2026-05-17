// useState is sufficient here - it deduplicates across composable calls without a separate store layer.
// Pinia would be the right call once multiple feature areas need shared state or DevTools inspection.
export function useAuth () {
  const user = useState<AuthUser | null>('auth:user', () => null)

  const isAuthenticated = computed(() => user.value !== null)

  function signIn (email: string, receiveUpdates: boolean) {
    user.value = { email, receiveUpdates }
  }

  function signOut () {
    user.value = null
  }

  return {
    user: readonly(user),
    isAuthenticated,
    signIn,
    signOut
  }
}
