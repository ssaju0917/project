// 選択肢マスタ（性格・特徴）
export type Personality = {
  id: number;
  name: string;
};

export type Character = {
  id: number;
  name: string;
};

// GET レスポンス用
export type User = {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  birth_date: string | null;   // 追加
  bio: string | null;          // 追加
  avatar_url: string | null;   // 追加
  permission_level: number;    // 追加
  created_at: string;
  personalities: Personality[]; // 追加：選択済み性格
  characters: Character[];      // 追加：選択済み特徴
};

// POST リクエスト用
export type UserCreate = {
  name: string;
  email: string;
};

// PUT リクエスト用（追加）
export type UserUpdate = {
  name: string;
  email: string;
  birth_date: string | null;
  bio: string | null;
  avatar_url: string | null;
  permission_level: number;
  personality_ids: number[];   // 追加：選択された性格IDの配列
  character_ids: number[];     // 追加：選択された特徴IDの配列
};
