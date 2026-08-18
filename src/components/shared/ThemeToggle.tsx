import { useAtom } from 'jotai'
import { Moon, Sun } from 'lucide-react'
import { useEffect } from 'react'

import { Button } from 'components/ui/button'
import { themeAtom } from 'store/theme'

export function ThemeToggle() {
  const [theme, setTheme] = useAtom(themeAtom)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <Button
      aria-label={
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      }
      onClick={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
      }}
      size="icon"
      variant="ghost"
    >
      {theme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  )
}
