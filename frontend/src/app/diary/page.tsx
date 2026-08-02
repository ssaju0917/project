"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useDiaryEntries } from "@/hooks/useDiary";
import { useTaskSummary } from "@/hooks/useTasks";
import SideMenu from "@/components/SideMenu";
import StatusBadge from "@/components/StatusBadge";
import TaskStatusDonut from "@/components/TaskStatusDonut";

export default function DiaryTopPage() {
  const { user } = useAuth();
  const { entries, loading, error } = useDiaryEntries();
  const { summary } = useTaskSummary();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col sm:flex-row gap-6">
        <SideMenu />

        <div className="flex-1 min-w-0 space-y-6">
          {/* プロフィールサマリー + 円グラフ */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-14 h-14 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-lg font-bold">
                  {user?.name.charAt(0) ?? "?"}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                  {user && (
                    <Link href={`/users/${user.id}`} className="text-xs text-blue-600 hover:underline">
                      更新
                    </Link>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">
                  学習内容：{user?.study_content || "未設定"}
                </p>
                {user?.dream && (
                  <p className="text-sm text-gray-500">将来の夢：{user.dream}</p>
                )}
              </div>
            </div>

            {summary && <TaskStatusDonut summary={summary} />}
          </div>

          {/* 日記作成ボタン */}
          <div className="flex justify-end">
            <Link
              href="/diary/new"
              className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-white text-sm font-medium rounded-full px-5 py-2 transition-colors shadow-sm"
            >
              ＋ 作成
            </Link>
          </div>

          {/* 日記一覧 */}
          {loading && <p className="text-sm text-gray-400">読み込み中...</p>}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </p>
          )}
          {!loading && !error && entries.length === 0 && (
            <p className="text-sm text-gray-400 bg-white border border-gray-200 rounded-xl px-4 py-6 text-center">
              まだ日記がありません。「作成」から今日の学習を記録しましょう。
            </p>
          )}

          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(entry.entry_date).toLocaleDateString("ja-JP", {
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <StatusBadge status={entry.status} />
                </div>
                <dl className="space-y-2 text-sm text-gray-700">
                  <div>
                    <dt className="text-xs text-gray-400">今日勉強したこと</dt>
                    <dd className="whitespace-pre-wrap">{entry.learned_content}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-400">一番の学びポイント</dt>
                    <dd className="whitespace-pre-wrap">{entry.key_learning_point}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-400">未解決なこと</dt>
                    <dd className="whitespace-pre-wrap">
                      {entry.unresolved_content || "なし"}
                    </dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
