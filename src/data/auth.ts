export interface AuthUser {
  id: number;
  username: string;
  passwordHash: string;
  createdAt: string;
}

const USERS_KEY = "kage.auth.users";
const SESSION_KEY = "kage.auth.session";
const ADMIN_SEEDED_KEY = "kage.auth.admin_seeded";

function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return `h${Math.abs(hash)}`;
}

export function loadUsers(): AuthUser[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AuthUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveUsers(users: AuthUser[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {}
}

export function getCurrentUsername(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(SESSION_KEY);
}

export function setCurrentUsername(username: string | null) {
  if (typeof window === "undefined") return;
  if (username) window.localStorage.setItem(SESSION_KEY, username);
  else window.localStorage.removeItem(SESSION_KEY);
}

export function registerUser(
  username: string,
  password: string
): { ok: true } | { ok: false; error: string } {
  const trimmedUser = username.trim();
  if (!trimmedUser || !password)
    return { ok: false, error: "아이디와 비밀번호를 입력하세요." };
  const users = loadUsers();
  if (
    users.find((u) => u.username.toLowerCase() === trimmedUser.toLowerCase())
  ) {
    return { ok: false, error: "이미 존재하는 아이디입니다." };
  }
  const newUser: AuthUser = {
    id: Date.now(),
    username: trimmedUser,
    passwordHash: simpleHash(password),
    createdAt: new Date().toISOString(),
  };
  saveUsers([newUser, ...users]);
  setCurrentUsername(trimmedUser);
  return { ok: true };
}

export function loginUser(
  username: string,
  password: string
): { ok: true } | { ok: false; error: string } {
  const users = loadUsers();
  const user = users.find(
    (u) => u.username.toLowerCase() === username.trim().toLowerCase()
  );
  if (!user)
    return { ok: false, error: "아이디 또는 비밀번호가 올바르지 않습니다." };
  if (user.passwordHash !== simpleHash(password))
    return { ok: false, error: "아이디 또는 비밀번호가 올바르지 않습니다." };
  setCurrentUsername(user.username);
  return { ok: true };
}

export function logoutUser() {
  setCurrentUsername(null);
}

export function seedAdminAccount(username: string, password: string) {
  if (typeof window === "undefined") return { created: false } as const;
  try {
    if (window.localStorage.getItem(ADMIN_SEEDED_KEY) === "1") {
      return { created: false } as const;
    }
    const users = loadUsers();
    const exists = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );
    if (exists) {
      window.localStorage.setItem(ADMIN_SEEDED_KEY, "1");
      return { created: false } as const;
    }
    const newUser: AuthUser = {
      id: Date.now(),
      username,
      passwordHash: simpleHash(password),
      createdAt: new Date().toISOString(),
    };
    saveUsers([newUser, ...users]);
    window.localStorage.setItem(ADMIN_SEEDED_KEY, "1");
    return { created: true } as const;
  } catch {
    return { created: false } as const;
  }
}
