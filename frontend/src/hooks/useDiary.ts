"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { DiaryEntry, DiaryEntryCreate } from "@/types/diary";

export function useDiaryEntries() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<DiaryEntry[]>("/diary/");
      setEntries(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "日記の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const createEntry = async (input: DiaryEntryCreate) => {
    const created = await api.post<DiaryEntry>("/diary/", input);
    setEntries((prev) => [created, ...prev]);
    return created;
  };

  return { entries, loading, error, createEntry, refetch: fetchEntries };
}
