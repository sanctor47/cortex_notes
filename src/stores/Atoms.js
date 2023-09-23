import { atom } from "jotai";

export const openEditor = atom(false);
export const activeNote = atom(false);
export const slectedNotes = atom([]);
export const themeAtom = atom(false);
export const labeslMangerOpen = atom(false);
export const labelFilter = atom("")
export const notesSearchTermAtom = atom("")
export const scrollLockAtom = atom(true)
