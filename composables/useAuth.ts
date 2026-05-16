export interface AuthUser {
  email: string
  receiveUpdates: boolean
}

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
