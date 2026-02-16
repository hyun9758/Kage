import { supabase } from "@/lib/supabase";

export interface BoardPost {
  id: number;
  title: string;
  content: string;
  relation?: string;
  createdAt: string; // ISO
  author?: string | null;
}

// Supabase에서 모든 게시글을 가져오기
export async function loadPosts(): Promise<BoardPost[]> {
  try {
    const { data, error } = await supabase
      .from("board_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("게시글 로드 오류:", error);
      return [];
    }

    // Supabase 데이터를 BoardPost 형식으로 변환
    return (
      data?.map((post) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        relation: post.relation || undefined,
        createdAt: post.created_at,
        author: post.author || null,
      })) || []
    );
  } catch (error) {
    console.error("게시글 로드 중 오류 발생:", error);
    return [];
  }
}

// Supabase에 새 게시글 추가
export async function addPostToStorage(
  post: Omit<BoardPost, "id">
): Promise<BoardPost | null> {
  try {
    const { data, error } = await supabase
      .from("board_posts")
      .insert({
        title: post.title,
        content: post.content,
        relation: post.relation || null,
        author: post.author || null,
        created_at: post.createdAt,
      })
      .select()
      .single();

    if (error) {
      console.error("게시글 추가 오류:", error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      content: data.content,
      relation: data.relation || undefined,
      createdAt: data.created_at,
      author: data.author || null,
    };
  } catch (error) {
    console.error("게시글 추가 중 오류 발생:", error);
    return null;
  }
}

// Supabase에서 게시글 삭제
export async function removePostFromStorage(id: number): Promise<boolean> {
  try {
    const { error } = await supabase.from("board_posts").delete().eq("id", id);

    if (error) {
      console.error("게시글 삭제 오류:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("게시글 삭제 중 오류 발생:", error);
    return false;
  }
}

// 기존 함수들 (호환성을 위해 유지하되 async로 변경)
export async function savePosts(_posts: BoardPost[]) {
  // 이 함수는 더 이상 사용되지 않지만 호환성을 위해 유지
  console.warn(
    "savePosts 함수는 더 이상 사용되지 않습니다. Supabase를 직접 사용하세요."
  );
}

// 동기 함수들 (기존 코드 호환성을 위해 유지)
export function loadPostsSync(): BoardPost[] {
  // 클라이언트 사이드에서만 작동하는 동기 버전
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem("kage.board.posts.fallback");
    if (!raw) return [];
    const parsed = JSON.parse(raw) as BoardPost[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addPostToStorageSync(post: BoardPost) {
  // 클라이언트 사이드에서만 작동하는 동기 버전 (fallback)
  if (typeof window === "undefined") return;
  try {
    const current = loadPostsSync();
    const updated = [post, ...current];
    window.localStorage.setItem(
      "kage.board.posts.fallback",
      JSON.stringify(updated)
    );
  } catch {
    // ignore
  }
}

export function removePostFromStorageSync(id: number) {
  // 클라이언트 사이드에서만 작동하는 동기 버전 (fallback)
  if (typeof window === "undefined") return;
  try {
    const current = loadPostsSync();
    const updated = current.filter((p) => p.id !== id);
    window.localStorage.setItem(
      "kage.board.posts.fallback",
      JSON.stringify(updated)
    );
  } catch {
    // ignore
  }
}
