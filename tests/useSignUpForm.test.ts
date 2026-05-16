import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useSignUpForm } from '~/composables/useSignUpForm'

const setup = () => useSignUpForm()

describe('useSignUpForm', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  describe('initial state', () => {
    it('starts with empty fields', () => {
      const { email, password, receiveUpdates } = setup()
      expect(email.value).toBe('')
      expect(password.value).toBe('')
      expect(receiveUpdates.value).toBe(false)
    })

    it('starts with no visible errors', () => {
      const { errors } = setup()
      expect(errors.value.email).toBeNull()
      expect(errors.value.password).toBeNull()
    })

    it('starts invalid', () => {
      const { isValid } = setup()
      expect(isValid.value).toBe(false)
    })
  })

  describe('email validation', () => {
    it('shows error after touch when empty', () => {
      const { errors, touched } = setup()
      touched.email = true
      expect(errors.value.email).toBe('Email is required')
    })

    it('shows error for invalid email format', () => {
      const { email, errors, touched } = setup()
      email.value = 'notanemail'
      touched.email = true
      expect(errors.value.email).toBe('Enter a valid email address')
    })

    it('accepts valid email', () => {
      const { email, errors } = setup()
      email.value = 'user@example.com'
      expect(errors.value.email).toBeNull()
    })

    it('trims whitespace before validating empty check', () => {
      const { email, errors, touched } = setup()
      email.value = '   '
      touched.email = true
      expect(errors.value.email).toBe('Email is required')
    })
  })

  describe('password validation', () => {
    it('shows error after touch when empty', () => {
      const { errors, touched } = setup()
      touched.password = true
      expect(errors.value.password).toBe('Password is required')
    })

    it('shows error when requirements not met', () => {
      const { password, errors, touched } = setup()
      password.value = 'short'
      touched.password = true
      expect(errors.value.password).toBe('Password does not meet all requirements')
    })

    it('accepts password meeting all requirements', () => {
      const { password, errors } = setup()
      password.value = 'ValidPass1!'
      expect(errors.value.password).toBeNull()
    })
  })

  describe('password requirements', () => {
    it('shows all 5 requirements', () => {
      const { passwordRequirements } = setup()
      expect(passwordRequirements.value).toHaveLength(5)
    })

    it('marks length requirement as met when >= 8 chars', () => {
      const { password, passwordRequirements } = setup()
      password.value = 'abcdefgh'
      const lengthReq = passwordRequirements.value.find(r => r.label === 'At least 8 characters')
      expect(lengthReq?.met).toBe(true)
    })

    it('marks all requirements as met for a valid password', () => {
      const { password, passwordRequirements } = setup()
      password.value = 'ValidPass1!'
      expect(passwordRequirements.value.every(r => r.met)).toBe(true)
    })

    it('marks all requirements as unmet for empty password', () => {
      const { passwordRequirements } = setup()
      expect(passwordRequirements.value.every(r => !r.met)).toBe(true)
    })
  })

  describe('touched state', () => {
    it('does not show errors before fields are touched', () => {
      const { email, password, errors } = setup()
      email.value = 'bad'
      password.value = 'bad'
      expect(errors.value.email).toBeNull()
      expect(errors.value.password).toBeNull()
    })

    it('shows errors only for touched fields', () => {
      const { email, password, errors, touched } = setup()
      email.value = 'bad'
      password.value = 'bad'
      touched.email = true
      expect(errors.value.email).not.toBeNull()
      expect(errors.value.password).toBeNull()
    })
  })

  describe('submit', () => {
    it('returns false and touches all fields when invalid', async () => {
      const { submit, touched, isValid } = setup()
      const result = await submit()
      expect(result).toBe(false)
      expect(touched.email).toBe(true)
      expect(touched.password).toBe(true)
      expect(isValid.value).toBe(false)
    })

    it('returns true when form is valid', async () => {
      const { email, password, submit } = setup()
      email.value = 'user@example.com'
      password.value = 'ValidPass1!'
      const promise = submit()
      vi.runAllTimers()
      expect(await promise).toBe(true)
    })

    it('sets isSubmitting during submission', async () => {
      const { email, password, submit, isSubmitting } = setup()
      email.value = 'user@example.com'
      password.value = 'ValidPass1!'
      const promise = submit()
      expect(isSubmitting.value).toBe(true)
      vi.runAllTimers()
      await promise
      expect(isSubmitting.value).toBe(false)
    })

    it('clears submitError on each new attempt', async () => {
      const { email, password, submit, submitError } = setup()
      email.value = 'user@example.com'
      password.value = 'ValidPass1!'
      submitError.value = 'Previous error'
      const promise = submit()
      vi.runAllTimers()
      await promise
      expect(submitError.value).toBeNull()
    })
  })
})
