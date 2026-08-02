export type TaskStatus = "未解決" | "対応中" | "解決済";

export type DiaryEntry = {
  id: number;
  entry_date: string;
  learned_content: string;        // 今日勉強したこと
  key_learning_point: string;     // 一番の学びポイント
  unresolved_content: string | null; // 未解決なこと
  status: TaskStatus;
  created_at: string;
};

// 日記作成（固定3問）リクエスト用
export type DiaryEntryCreate = {
  learned_content: string;
  key_learning_point: string;
  unresolved_content: string | null;
};

export type Task = {
  id: number;
  title: string;
  description: string | null;
  study_time: string | null;
  status: TaskStatus;
  diary_entry_id: number | null;
  created_at: string;
};

export type TaskCreate = {
  title: string;
  description?: string | null;
  study_time?: string | null;
  status?: TaskStatus;
};

export type TaskUpdate = {
  title?: string;
  description?: string | null;
  study_time?: string | null;
  status?: TaskStatus;
};

export type TaskStatusSummary = {
  unresolved: number;
  in_progress: number;
  resolved: number;
  total: number;
};
