export interface SignUpFormData {
  email: string
  password: string
  receiveUpdates: boolean
}

export interface FieldErrors {
  email: string | null
  password: string | null
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_MIN_LENGTH = 8

function validateEmail (value: string): string | null {
  if (!value.trim()) return 'Email is required'
  if (!EMAIL_REGEX.test(value)) return 'Enter a valid email address'
  return null
}

function validatePassword (value: string): string | null {
  if (!value) return 'Password is required'
  if (value.length < PASSWORD_MIN_LENGTH) return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`
  return null
}

export function useSignUpForm () {
  const email = ref('')
  const password = ref('')
  const receiveUpdates = ref(false) // False by default because GDPR compliance

  const touched = reactive({ email: false, password: false })
  const isSubmitting = ref(false)
  const submitError = ref<string | null>(null)

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
      await new Promise(resolve => setTimeout(resolve, 600))
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
    isValid,
    isSubmitting,
    submitError,
    submit
  }
}
