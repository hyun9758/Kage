"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CharactersHeader from "@/components/CharactersHeader";
import {
  BoardPost,
  loadPosts,
  addPostToStorage,
  removePostFromStorage,
} from "@/data/board";
import { getCurrentUsername } from "@/data/auth";

export default function BoardPage() {
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [relation, setRelation] = useState("");
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    setPosts(loadPosts());
    setUsername(getCurrentUsername());
    const onStorage = () => setUsername(getCurrentUsername());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const canManage = (post: BoardPost) => {
    if (!username) return false;
    if (username === "admin") return true;
    return post.author === username;
  };

  const addPost = () => {
    if (!username) return;
    if (!title.trim() || !content.trim()) return;
    const newPost: BoardPost = {
      id: Date.now(),
      title: title.trim(),
      content: content.trim(),
      relation: relation.trim() || undefined,
      createdAt: new Date().toISOString(),
      author: username,
    };
    addPostToStorage(newPost);
    setPosts((prev) => [newPost, ...prev]);
    setTitle("");
    setContent("");
    setRelation("");
  };

  const removePost = (id: number) => {
    const target = posts.find((p) => p.id === id);
    if (!target || !canManage(target)) return;
    removePostFromStorage(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <CharactersHeader />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">자유 게시판</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/board/posts"
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              전체 목록
            </Link>
            <Link
              href="/"
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              홈으로
            </Link>
          </div>
        </div>

        {username ? (
          <div className="bg-black/70 border border-red-500/20 rounded-2xl p-6 mb-8">
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/40 border border-red-500/20 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="text"
                placeholder="관계 / 태그 (선택) — 예: 아리아 × 카이, 라이벌"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/40 border border-red-500/20 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <textarea
                placeholder="내용을 작성하세요"
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/40 border border-red-500/20 text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-y"
              />
              <div className="flex justify-end">
                <button
                  onClick={addPost}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-colors"
                >
                  작성하기
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-black/70 border border-red-500/20 rounded-2xl p-6 mb-8 text-gray-300">
            게시글 작성은 로그인한 사용자만 가능합니다.{" "}
            <Link
              href="/auth/login"
              className="text-red-400 hover:text-red-300"
            >
              로그인
            </Link>{" "}
            또는{" "}
            <Link
              href="/auth/register"
              className="text-red-400 hover:text-red-300"
            >
              회원가입
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center text-gray-400 py-10 border border-dashed border-red-500/20 rounded-2xl">
              아직 게시글이 없습니다. 첫 글을 작성해보세요!
            </div>
          ) : (
            posts.map((post) => (
              <article
                key={post.id}
                className="bg-black/70 border border-red-500/20 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {post.title}
                    </h2>
                    <div className="text-xs text-gray-400">
                      작성자: {post.author || "익명"}
                    </div>
                  </div>
                  {canManage(post) && (
                    <button
                      onClick={() => removePost(post.id)}
                      className="text-sm text-red-300 hover:text-red-200"
                    >
                      삭제
                    </button>
                  )}
                </div>
                {post.relation && (
                  <div className="mb-2">
                    <span className="px-2 py-1 text-xs rounded-full border border-red-500/30 text-red-300">
                      {post.relation}
                    </span>
                  </div>
                )}
                <p className="text-gray-300 whitespace-pre-wrap">
                  {post.content}
                </p>
                <div className="mt-3 text-xs text-gray-500">
                  {new Date(post.createdAt).toLocaleString("ko-KR")}
                </div>
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
