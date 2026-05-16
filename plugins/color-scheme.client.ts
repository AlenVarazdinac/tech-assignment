export default defineNuxtPlugin(() => {
  // Key uses colon-namespacing (color-scheme:dark, color-scheme:contrast, color-scheme:preference...)
  // Keeps related keys grouped and avoids localStorage collisions.
  const isDark = useState('color-scheme:dark', () => false)

  // Default to system preference, then override with user's stored choice if it exists
  isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  const stored = localStorage.getItem('color-scheme:dark')
  if (stored !== null) isDark.value = stored === 'true'

  watch(isDark, val => localStorage.setItem('color-scheme:dark', String(val)))
})
