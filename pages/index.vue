<script setup lang="ts">
import '@nordhealth/components/lib/Input'
import '@nordhealth/components/lib/Button'
import '@nordhealth/components/lib/Icon'
import '@nordhealth/components/lib/Checkbox'
import '@nordhealth/components/lib/Card'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const receiveUpdates = ref(false) // Default to false due to GDPR

const onEmailInput = (e: Event) => {
  email.value = (e.target as HTMLInputElement).value
}

const onPasswordInput = (e: Event) => {
  password.value = (e.target as HTMLInputElement).value
}

const onReceiveUpdatesInput = (e: Event) => {
  receiveUpdates.value = (e.target as HTMLInputElement).checked
}

const onSignUp = () => {
  console.log('Sign Up', email.value, password.value, receiveUpdates.value)
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
              expand
              required
              @input="onEmailInput"
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
              expand
              required
              @input="onPasswordInput"
            >
              <nord-icon
                slot="start"
                name="interface-lock"
              />
              <nord-button
                slot="end"
                type="button"
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
              @change="onReceiveUpdatesInput"
            />
          </div>

          <nord-button
            slot="footer"
            variant="primary"
            expand
            @click="onSignUp"
          >
            Sign Up
          </nord-button>
        </nord-card>
      </div>
    </ClientOnly>
  </div>
</template>
