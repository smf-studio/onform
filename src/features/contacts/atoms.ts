import { atom } from 'jotai'

/* Feature-local state stays inside the feature. Only genuinely global
   atoms belong in src/store/. */
export const contactsFilterAtom = atom('')
