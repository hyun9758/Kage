export interface BoardPost {
  id: number;
  title: string;
  content: string;
  relation?: string;
  createdAt: string; // ISO
  author?: string | null;
}

const STORAGE_KEY = "kage.board.posts";

export function loadPosts(): BoardPost[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as BoardPost[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function savePosts(posts: BoardPost[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch {
    // ignore
  }
}

export function addPostToStorage(post: BoardPost) {
  const current = loadPosts();
  const updated = [post, ...current];
  savePosts(updated);
}

export function removePostFromStorage(id: number) {
  const current = loadPosts();
  const updated = current.filter((p) => p.id !== id);
  savePosts(updated);
}
