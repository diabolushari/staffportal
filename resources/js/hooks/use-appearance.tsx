import { useCallback, useEffect, useState } from 'react'

export type Appearance = 'light'

const LIGHT_APPEARANCE: Appearance = 'light'

const setCookie = (name: string, value: string, days = 365) => {
  if (typeof document === 'undefined') {
    return
  }

  const maxAge = days * 24 * 60 * 60
  document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`
}

const applyTheme = (): void => {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.classList.remove('dark')
}

const persistLightAppearance = (): void => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('appearance', LIGHT_APPEARANCE)
  }

  setCookie('appearance', LIGHT_APPEARANCE)
}

export function initializeTheme(): void {
  applyTheme()
  persistLightAppearance()
}

export function useAppearance() {
  const [appearance, setAppearance] = useState<Appearance>(LIGHT_APPEARANCE)

  const updateAppearance = useCallback(() => {
    setAppearance(LIGHT_APPEARANCE)
    persistLightAppearance()
    applyTheme()
  }, [])

  useEffect(() => {
    updateAppearance()
  }, [updateAppearance])

  return { appearance, updateAppearance } as const
}
