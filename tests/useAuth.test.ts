import { describe, it, expect } from 'vitest'
import { useAuth } from '~/composables/useAuth'

const setup = () => useAuth()

describe('useAuth', () => {
  describe('initial state', () => {
    it('starts unauthenticated', () => {
      const { isAuthenticated } = setup()
      expect(isAuthenticated.value).toBe(false)
    })

    it('starts with no user', () => {
      const { user } = setup()
      expect(user.value).toBeNull()
    })
  })

  describe('signIn', () => {
    it('sets the user', () => {
      const { user, signIn } = setup()
      signIn('user@example.com', false)
      expect(user.value).toEqual({ email: 'user@example.com', receiveUpdates: false })
    })

    it('marks as authenticated', () => {
      const { isAuthenticated, signIn } = setup()
      signIn('user@example.com', false)
      expect(isAuthenticated.value).toBe(true)
    })

    it('stores receiveUpdates preference', () => {
      const { user, signIn } = setup()
      signIn('user@example.com', true)
      expect(user.value?.receiveUpdates).toBe(true)
    })
  })

  describe('signOut', () => {
    it('clears the user', () => {
      const { user, signIn, signOut } = setup()
      signIn('user@example.com', false)
      signOut()
      expect(user.value).toBeNull()
    })

    it('marks as unauthenticated', () => {
      const { isAuthenticated, signIn, signOut } = setup()
      signIn('user@example.com', false)
      signOut()
      expect(isAuthenticated.value).toBe(false)
    })
  })
})
