export function useColorScheme () {
  const isDark = useState('color-scheme:dark', () => false)

  function toggle () {
    isDark.value = !isDark.value
  }

  return { isDark: readonly(isDark), toggle }
}
