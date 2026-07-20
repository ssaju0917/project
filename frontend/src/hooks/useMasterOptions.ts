"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type MasterOption = {
  id: number;
  name: string;
};

// 「選択肢一覧をAPIから取ってくる」処理を再利用可能な形にまとめたフック
function useMasterOptions(path: string) {
  const [items, setItems]     = useState<MasterOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get<MasterOption[]>(path);
        setItems(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "選択肢の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [path]);

  return { items, loading, error };
}

export function usePersonalities() {
  return useMasterOptions("/personalities");
}

export function useCharacters() {
  return useMasterOptions("/characters");
}
