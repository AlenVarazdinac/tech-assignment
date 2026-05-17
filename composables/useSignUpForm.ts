// Validation is intentionally written manually rather than delegated to a library (e.g. Vuelidate, VeeValidate).
// For two fields with straightforward rules, a composable is sufficient and avoids an unnecessary
// dependency, bundle overhead, and the indirection of a framework-specific abstraction.
// If the form grows (async server-side checks, cross-field rules, many fields), migrating to a
// dedicated library at that point would be the right call.

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const PASSWORD_RULES: Array<{ label: string, test: (v: string) => boolean }> = [
  { label: 'At least 8 characters', test: v => v.length >= 8 },
  { label: 'At least one uppercase letter', test: v => /[A-Z]/.test(v) },
  { label: 'At least one lowercase letter', test: v => /[a-z]/.test(v) },
  { label: 'At least one number', test: v => /[0-9]/.test(v) },
  { label: 'At least one special character', test: v => /[^A-Za-z0-9]/.test(v) }
]

function validateEmail (value: string): string | null {
  if (!value.trim()) return 'Email is required'
  if (!EMAIL_REGEX.test(value)) return 'Enter a valid email address'
  return null
}

function validatePassword (value: string): string | null {
  if (!value) return 'Password is required'
  const allMet = PASSWORD_RULES.every(rule => rule.test(value))
  if (!allMet) return 'Password does not meet all requirements'
  return null
}

export function useSignUpForm () {
  const email = ref('')
  const password = ref('')
  const receiveUpdates = ref(false) // False by default for GDPR compliance

  const touched = reactive({ email: false, password: false })
  const isSubmitting = ref(false)
  const submitError = ref<string | null>(null)

  const passwordRequirements = computed<PasswordRequirement[]>(() =>
    PASSWORD_RULES.map(rule => ({ label: rule.label, met: rule.test(password.value) }))
  )

  const errors = computed<FieldErrors>(() => ({
    email: validateEmail(email.value),
    password: validatePassword(password.value)
  }))

  const visibleErrors = computed<FieldErrors>(() => ({
    email: touched.email ? errors.value.email : null,
    password: touched.password ? errors.value.password : null
  }))

  const isValid = computed(() => !errors.value.email && !errors.value.password)

  function touchAll () {
    touched.email = true
    touched.password = true
  }

  async function submit (): Promise<boolean> {
    touchAll()
    if (!isValid.value) return false

    isSubmitting.value = true
    submitError.value = null
    try {
      // Simulate async submission — replace with real API call
      await new Promise<void>(resolve => setTimeout(resolve, 600))
      return true
    }
    catch {
      submitError.value = 'Something went wrong. Please try again.'
      return false
    }
    finally {
      isSubmitting.value = false
    }
  }

  return {
    email,
    password,
    receiveUpdates,
    touched,
    errors: visibleErrors,
    passwordRequirements,
    isValid,
    isSubmitting,
    submitError,
    submit
  }
}
