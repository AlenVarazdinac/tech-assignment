import darkThemeCSS from '@nordhealth/themes/lib/vet-dark.css?raw'

export function useColorScheme () {
  const isDark = useState('color-scheme:dark', () => false)

  useHead(computed(() => ({
    style: isDark.value
      ? [{ id: 'n-theme-dark', innerHTML: darkThemeCSS }]
      : []
  })))

  function toggle () {
    isDark.value = !isDark.value
  }

  return { isDark: readonly(isDark), toggle }
}
