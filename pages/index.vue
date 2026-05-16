<script setup lang="ts">
import '@nordhealth/components/lib/Input'
import '@nordhealth/components/lib/Button'
import '@nordhealth/components/lib/Icon'
import '@nordhealth/components/lib/Checkbox'
import '@nordhealth/components/lib/Card'

useHead({ title: 'Create an account' })

const showPassword = ref(false)
const { signIn } = useAuth()

const {
  email,
  password,
  receiveUpdates,
  touched,
  errors,
  isSubmitting,
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
  }
}
</script>

<template>
  <div class="page n:flex n:items-center n:justify-center n:min-h-screen">
    <ClientOnly>
      <div class="n:container-xs">
        <nord-card padding="l">
          <h2
            slot="header"
            class="n:text-heading-2"
          >
            Create an account
          </h2>

          <div class="n:flex n:flex-col n:gap-l">
            <nord-input
              label="Email"
              :value="email"
              type="email"
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

            <nord-input
              label="Password"
              :value="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              :error="errors.password ?? undefined"
              hint="Minimum 8 characters"
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

            <nord-checkbox
              label="Receive occasional product updates and announcements"
              :checked="receiveUpdates"
              size="s"
              @change="onReceiveUpdatesChange"
            />
          </div>

          <nord-button
            slot="footer"
            variant="primary"
            expand
            :loading="isSubmitting"
            @click="onSignUp"
          >
            Sign Up
          </nord-button>
        </nord-card>
      </div>
    </ClientOnly>
  </div>
</template>
