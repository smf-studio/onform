import { atomWithStorage } from 'jotai/utils'

/* Global (cross-feature) state only — feature state lives next to its
   feature in `features/<name>/atoms.ts`. */

export type Theme = 'dark' | 'light'

export const themeAtom = atomWithStorage<Theme>('theme', 'light')
