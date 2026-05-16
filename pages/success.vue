<script setup lang="ts">
import '@nordhealth/components/lib/Card'
import '@nordhealth/components/lib/Icon'

useHead({ title: 'You\'re all set!' })

const { user } = useAuth()
const email = computed(() => user.value?.email ?? '')
const receiveUpdates = computed(() => user.value?.receiveUpdates ?? false)
</script>

<template>
  <div class="page n:flex n:items-center n:justify-center n:min-h-screen">
    <div class="n:container-xs">
      <nord-card padding="l">
        <div class="n:flex n:flex-col n:items-center n:gap-l n:text-center">
          <nord-icon
            name="interface-checked-circle"
            size="xl"
            color="var(--n-color-status-success)"
          />

          <div class="n:flex n:flex-col n:gap-s">
            <h2 class="n:text-heading-2">
              You're all set!
            </h2>
            <p class="n:text-body">
              Welcome aboard. We've created your account for
              <strong>{{ email }}</strong>.
            </p>
            <p
              v-if="receiveUpdates"
              class="n:text-body-s"
            >
              Thanks for subscribing! We'll keep you posted on product updates and announcements.
            </p>
          </div>
        </div>
      </nord-card>
    </div>
  </div>
</template>
