<script setup lang="ts">
import '@nordhealth/components/lib/Input'
import '@nordhealth/components/lib/Button'
import '@nordhealth/components/lib/Icon'
import '@nordhealth/components/lib/Checkbox'
import '@nordhealth/components/lib/Card'
import '@nordhealth/components/lib/Banner'
import '@nordhealth/components/lib/Stack'

useHead({ title: 'Create an account' })

const showPassword = ref(false)
const { signIn } = useAuth()

const emailInputRef = useTemplateRef<HTMLElement>('emailInput')
const passwordInputRef = useTemplateRef<HTMLElement>('passwordInput')

onMounted(async () => {
  await customElements.whenDefined('nord-input')
  emailInputRef.value?.focus()
})

const {
  email,
  password,
  receiveUpdates,
  touched,
  errors,
  passwordRequirements,
  isValid,
  isSubmitting,
  submitError,
  submit
} = useSignUpForm()

const onEmailInput = (e: Event) => {
  email.value = (e.target as HTMLInputElement).value
}

const onPasswordInput = (e: Event) => {
  password.value = (e.target as HTMLInputElement).value
}

const onReceiveUpdatesChange = (e: Event) => {
  receiveUpdates.value = (e.target as HTMLInputElement).checked
}

const onSignUp = async () => {
  const success = await submit()
  if (success) {
    signIn(email.value, receiveUpdates.value)
    navigateTo('/success')
    return
  }

  // If the form is not valid, focus the first invalid field
  if (!isValid.value) {
    await nextTick()
    if (errors.value.email) emailInputRef.value?.focus()
    else passwordInputRef.value?.focus()
  }
}
</script>

<template>
  <div class="page n:flex n:items-center n:justify-center n:min-h-screen">
    <div class="n:container-xs">
      <form @submit.prevent="onSignUp">
        <nord-card padding="l">
          <h2
            slot="header"
            class="n:text-heading-2"
          >
            Create an account
          </h2>

          <div class="n:flex n:flex-col n:gap-l">
            <nord-banner
              v-if="submitError"
              variant="danger"
              role="alert"
            >
              {{ submitError }}
            </nord-banner>

            <nord-input
              ref="emailInput"
              label="Email"
              :value="email"
              type="email"
              autocomplete="email"
              placeholder="Enter your email"
              :error="errors.email ?? undefined"
              expand
              required
              @input="onEmailInput"
              @blur="touched.email = true"
            >
              <nord-icon
                slot="start"
                name="interface-email"
              />
            </nord-input>

            <div class="n:flex n:flex-col n:gap-s">
              <nord-input
                ref="passwordInput"
                label="Password"
                :value="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="Enter your password"
                :error="errors.password ?? undefined"
                expand
                required
                @input="onPasswordInput"
                @blur="touched.password = true"
              >
                <nord-icon
                  slot="start"
                  name="interface-lock"
                />
                <nord-button
                  slot="end"
                  type="button"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  @click="showPassword = !showPassword"
                >
                  <nord-icon
                    :name="showPassword ? 'interface-edit-off' : 'interface-edit-on'"
                  />
                </nord-button>
              </nord-input>

              <ul
                v-if="password.length > 0"
                class="password-requirements n:flex n:flex-col n:gap-xs"
                aria-label="Password requirements"
                aria-live="polite"
              >
                <li
                  v-for="req in passwordRequirements"
                  :key="req.label"
                  class="n:flex n:items-center n:gap-xs n:text-body-s"
                  :class="req.met ? 'requirement--met' : 'requirement--unmet'"
                >
                  <nord-icon
                    :name="req.met ? 'interface-checked' : 'interface-close'"
                    size="s"
                  />
                  {{ req.label }}
                </li>
              </ul>
            </div>

            <nord-checkbox
              label="Receive occasional product updates and announcements"
              :checked="receiveUpdates"
              size="s"
              @change="onReceiveUpdatesChange"
            />
          </div>

          <nord-button
            slot="footer"
            type="submit"
            variant="primary"
            expand
            :loading="isSubmitting"
          >
            Sign Up
          </nord-button>
        </nord-card>
      </form>
    </div>
  </div>
</template>

<style scoped>
.password-requirements {
  list-style: none;
  padding: 0;
  margin: 0;
}

.requirement--met {
  color: var(--n-color-status-success);
}

.requirement--unmet {
  color: var(--n-color-text-weaker);
}
</style>
