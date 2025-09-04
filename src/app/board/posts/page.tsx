"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CharactersHeader from "@/components/CharactersHeader";
import { BoardPost, loadPosts } from "@/data/board";

export default function BoardPostsPage() {
  const [posts, setPosts] = useState<BoardPost[]>([]);

  useEffect(() => {
    setPosts(loadPosts());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <CharactersHeader />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">게시글 전체 목록</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/board"
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              글 작성하기
            </Link>
            <Link
              href="/"
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              홈으로
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center text-gray-400 py-10 border border-dashed border-red-500/20 rounded-2xl">
              저장된 게시글이 없습니다.
            </div>
          ) : (
            posts.map((post) => (
              <article
                key={post.id}
                className="bg-black/70 border border-red-500/20 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold text-white">
                    {post.title}
                  </h2>
                  <span className="text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleString("ko-KR")}
                  </span>
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
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
