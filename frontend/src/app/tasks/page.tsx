"use client";

import { useState } from "react";
import Link from "next/link";
import { useTasks } from "@/hooks/useTasks";
import { Task, TaskStatus } from "@/types/diary";
import SideMenu from "@/components/SideMenu";

const COLUMNS: { status: TaskStatus; color: string }[] = [
  { status: "未解決", color: "bg-red-50 text-red-700 border-red-100" },
  { status: "対応中", color: "bg-amber-50 text-amber-700 border-amber-100" },
  { status: "解決済", color: "bg-green-50 text-green-700 border-green-100" },
];

function TaskCard({
  task,
  onStatusChange,
}: {
  task: Task;
  onStatusChange: (status: TaskStatus) => void;
}) {
  return (
    <div className="bg-teal-50 border border-teal-100 rounded-lg p-3 space-y-2">
      <p className="text-sm font-medium text-blue-700 underline decoration-blue-300 underline-offset-2">
        {task.title}
      </p>
      {task.description && (
        <p className="text-xs text-gray-600 whitespace-pre-wrap">{task.description}</p>
      )}
      {task.study_time && (
        <p className="text-xs text-gray-500">学習時間：{task.study_time}</p>
      )}
      <select
        value={task.status}
        onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
        className="text-xs border border-gray-200 rounded px-2 py-1 bg-white"
      >
        <option value="未解決">未解決</option>
        <option value="対応中">対応中</option>
        <option value="解決済">解決済</option>
      </select>
    </div>
  );
}

export default function TasksPage() {
  const { tasks, loading, error, createTask, updateTask } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [studyTime, setStudyTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    setFormError(null);
    try {
      await createTask({
        title: title.trim(),
        description: description.trim() || null,
        study_time: studyTime.trim() || null,
      });
      setTitle("");
      setDescription("");
      setStudyTime("");
      setShowForm(false);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "タスクの作成に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col sm:flex-row gap-6">
        <SideMenu />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-lg font-semibold text-gray-800">タスク一覧</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowForm((v) => !v)}
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-1.5 transition-colors"
              >
                ＋ タスクを作成
              </button>
              <Link href="/diary" className="text-sm text-blue-600 hover:underline">
                一覧画面に戻る →
              </Link>
            </div>
          </div>

          {showForm && (
            <form
              onSubmit={handleCreate}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-6 space-y-3"
            >
              {formError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {formError}
                </p>
              )}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="タスク名（必須）"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="メモ（任意）"
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <input
                type="text"
                value={studyTime}
                onChange={(e) => setStudyTime(e.target.value)}
                placeholder="学習時間・学習目安（任意）"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
              >
                {submitting ? "作成中..." : "作成する"}
              </button>
            </form>
          )}

          {loading && <p className="text-sm text-gray-400">読み込み中...</p>}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {COLUMNS.map((col) => {
                const columnTasks = tasks.filter((t) => t.status === col.status);
                return (
                  <div
                    key={col.status}
                    className="bg-white border border-gray-200 rounded-xl p-3 space-y-3"
                  >
                    <div
                      className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 border text-sm font-medium ${col.color}`}
                    >
                      <span>{col.status}</span>
                      <span className="text-xs">{columnTasks.length}件</span>
                    </div>
                    <div className="space-y-2 min-h-[3rem]">
                      {columnTasks.length === 0 ? (
                        <p className="text-xs text-gray-300 text-center py-4">タスクなし</p>
                      ) : (
                        columnTasks.map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            onStatusChange={(status) => updateTask(task.id, { status })}
                          />
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
