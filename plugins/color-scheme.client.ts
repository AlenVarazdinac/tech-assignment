import darkThemeCSS from '@nordhealth/themes/lib/vet-dark.css?raw'

function applyTheme (dark: boolean) {
  const existing = document.getElementById('n-theme-dark')
  if (dark && !existing) {
    const style = document.createElement('style')
    style.id = 'n-theme-dark'
    style.innerHTML = darkThemeCSS
    document.head.appendChild(style)
  }
  else if (!dark && existing) {
    existing.remove()
  }
}

export default defineNuxtPlugin(() => {
  // Key uses colon-namespacing (color-scheme:dark, color-scheme:contrast, color-scheme:preference...)
  // Keeps related keys grouped and avoids localStorage collisions.
  const isDark = useState('color-scheme:dark', () => false)

  // Prefer the user's stored choice; fall back to system preference on first visit
  const stored = localStorage.getItem('color-scheme:dark')
  isDark.value = stored !== null
    ? stored === 'true'
    : window.matchMedia('(prefers-color-scheme: dark)').matches

  applyTheme(isDark.value)
  watch(isDark, (val) => {
    applyTheme(val)
    localStorage.setItem('color-scheme:dark', String(val))
  })
})
