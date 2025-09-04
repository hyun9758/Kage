import type { Character } from "@/data/characters";

export interface StoredCharacter extends Character {
  owner: string; // username
}

const STORAGE_KEY = "kage.user.characters";

export function loadUserCharacters(): StoredCharacter[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredCharacter[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveUserCharacters(chars: StoredCharacter[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(chars));
  } catch {}
}

export function addUserCharacter(char: StoredCharacter) {
  const current = loadUserCharacters();
  saveUserCharacters([char, ...current]);
}

export function removeUserCharacter(id: number) {
  const current = loadUserCharacters();
  saveUserCharacters(current.filter((c) => c.id !== id));
}
