export interface AuthUser {
  email: string
  receiveUpdates: boolean
}

export interface FieldErrors {
  email: string | null
  password: string | null
}

export interface PasswordRequirement {
  label: string
  met: boolean
}
