<script setup lang="ts">
import '@nordhealth/components/lib/Button'
import '@nordhealth/components/lib/Icon'

const { isDark, toggle } = useColorScheme()
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />

    <div class="theme-toggle">
      <nord-button
        type="button"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        @click="toggle"
      >
        <nord-icon
          v-if="isDark"
          name="interface-mode-light"
        />
        <nord-icon
          v-else
          name="interface-mode-dark"
        />
      </nord-button>
    </div>

    <NuxtPage />
  </div>
</template>

<style scoped>
.theme-toggle {
  position: fixed;
  top: var(--n-space-m);
  right: var(--n-space-m);
  z-index: 100;
}
</style>
