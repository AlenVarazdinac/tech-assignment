<script setup lang="ts">
import '@nordhealth/components/lib/Input'
import '@nordhealth/components/lib/Button'
import '@nordhealth/components/lib/Icon'

const password = ref('')
const showPassword = ref(false)

const onPasswordInput = (e: Event) => {
  password.value = (e.target as HTMLInputElement).value
}
</script>

<template>
  <div class="page">
    <ClientOnly>
      <nord-input
        :value="password"
        :type="showPassword ? 'text' : 'password'"
        label="Password"
        required
        @input="onPasswordInput"
      >
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
    </ClientOnly>
  </div>
</template>
