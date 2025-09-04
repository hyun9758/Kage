export interface RoleplayMessage {
  id: number;
  characterId: number;
  content: string;
  image?: string | null;
  author?: string | null; // username
  createdAt: string; // ISO
}

const STORAGE_KEY = "kage.roleplay.messages";

export function loadRoleplayMessages(): RoleplayMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RoleplayMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRoleplayMessages(messages: RoleplayMessage[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {}
}

export function addRoleplayMessage(message: RoleplayMessage) {
  const current = loadRoleplayMessages();
  saveRoleplayMessages([message, ...current]);
}

export function clearRoleplayMessages() {
  saveRoleplayMessages([]);
}

export function removeRoleplayMessage(id: number) {
  const current = loadRoleplayMessages();
  saveRoleplayMessages(current.filter((m) => m.id !== id));
}
