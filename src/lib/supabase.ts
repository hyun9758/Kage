import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase environment variables are missing!");
  console.error("Please check your .env.local file:");
  console.error("- NEXT_PUBLIC_SUPABASE_URL");
  console.error("- NEXT_PUBLIC_SUPABASE_ANON_KEY");
  throw new Error("Supabase configuration is incomplete");
}

console.log("✅ Supabase client initialized with URL:", supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 데이터베이스 타입 정의
export interface Database {
  public: {
    Tables: {
      characters: {
        Row: {
          id: number;
          name: string;
          age: string;
          personality: string;
          description: string;
          background: string;
          image: string | null;
          color: string | null;
          likes: number;
          shares: number;
          views: number;
          owner: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          age: string;
          personality: string;
          description: string;
          background: string;
          image?: string | null;
          color?: string | null;
          likes?: number;
          shares?: number;
          views?: number;
          owner: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          age?: string;
          personality?: string;
          description?: string;
          background?: string;
          image?: string | null;
          color?: string | null;
          likes?: number;
          shares?: number;
          views?: number;
          owner?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      roleplay_messages: {
        Row: {
          id: number;
          character_id: number;
          message: string;
          author: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          character_id: number;
          message: string;
          author: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          character_id?: number;
          message?: string;
          author?: string;
          created_at?: string;
        };
      };
      board_posts: {
        Row: {
          id: number;
          title: string;
          content: string;
          relation: string | null;
          author: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          content: string;
          relation?: string | null;
          author?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          content?: string;
          relation?: string | null;
          author?: string | null;
          created_at?: string;
        };
      };
      users: {
        Row: {
          id: number;
          username: string;
          password_hash: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          username: string;
          password_hash: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          username?: string;
          password_hash?: string;
          created_at?: string;
        };
      };
    };
  };
}
