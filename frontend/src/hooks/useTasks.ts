"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { Task, TaskCreate, TaskUpdate, TaskStatusSummary } from "@/types/diary";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<Task[]>("/tasks/");
      setTasks(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "タスクの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (input: TaskCreate) => {
    const created = await api.post<Task>("/tasks/", input);
    setTasks((prev) => [created, ...prev]);
    return created;
  };

  const updateTask = async (id: number, input: TaskUpdate) => {
    const updated = await api.put<Task>(`/tasks/${id}`, input);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  };

  const deleteTask = async (id: number) => {
    await api.delete<Task>(`/tasks/${id}`);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return { tasks, loading, error, createTask, updateTask, deleteTask, refetch: fetchTasks };
}

export function useTaskSummary() {
  const [summary, setSummary] = useState<TaskStatusSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<TaskStatusSummary>("/tasks/summary");
      setSummary(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "サマリーの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { summary, loading, error, refetch: fetchSummary };
}
