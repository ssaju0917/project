"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDiaryEntries } from "@/hooks/useDiary";

type Field = "learned_content" | "key_learning_point" | "unresolved_content";

const QUESTIONS: { field: Field; text: string }[] = [
  { field: "learned_content", text: "Q1. 今日は何を学習した？" },
  { field: "key_learning_point", text: "Q2. 一番の学びポイントは？" },
  { field: "unresolved_content", text: "Q3. 未解決なことはある？（なければ「なし」を押してね）" },
];

type Message = { role: "bot" | "user"; text: string };

export default function DiaryNewPage() {
  const router = useRouter();
  const { createEntry } = useDiaryEntries();

  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: QUESTIONS[0].text },
  ]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<Field, string>>({
    learned_content: "",
    key_learning_point: "",
    unresolved_content: "",
  });
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const currentQuestion = QUESTIONS[step];

  const advance = async (answerText: string) => {
    const field = currentQuestion.field;
    const nextAnswers = { ...answers, [field]: answerText };
    setAnswers(nextAnswers);
    setMessages((prev) => [...prev, { role: "user", text: answerText || "（なし）" }]);
    setInput("");

    const nextStep = step + 1;
    if (nextStep < QUESTIONS.length) {
      setStep(nextStep);
      setMessages((prev) => [...prev, { role: "bot", text: QUESTIONS[nextStep].text }]);
      return;
    }

    // 最後の質問への回答 → 日記を作成
    setSubmitting(true);
    setError(null);
    try {
      await createEntry({
        learned_content: nextAnswers.learned_content,
        key_learning_point: nextAnswers.key_learning_point,
        unresolved_content: nextAnswers.unresolved_content || null,
      });
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "今日もお疲れさま！日記を保存したよ。" },
      ]);
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "日記の保存に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || submitting || done) return;
    advance(input.trim());
  };

  const handleSkip = () => {
    if (submitting || done) return;
    advance("");
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex justify-end mb-4">
          <Link href="/diary" className="text-sm text-blue-600 hover:underline">
            一覧画面に戻る →
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h1 className="text-lg font-semibold text-gray-800 mb-6">日記作成</h1>

          <div className="space-y-4 mb-6">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "bot" && (
                  <span className="text-xl" aria-hidden="true">🤖</span>
                )}
                <p
                  className={`text-sm px-4 py-2 rounded-2xl max-w-[75%] whitespace-pre-wrap ${
                    m.role === "bot"
                      ? "bg-gray-100 text-gray-800 rounded-bl-sm"
                      : "bg-blue-600 text-white rounded-br-sm"
                  }`}
                >
                  {m.text}
                </p>
                {m.role === "user" && (
                  <span className="text-xl" aria-hidden="true">🧑</span>
                )}
              </div>
            ))}
            {submitting && (
              <div className="flex items-end gap-2 justify-start">
                <span className="text-xl" aria-hidden="true">🤖</span>
                <p className="text-sm px-4 py-2 rounded-2xl bg-gray-100 text-gray-400 rounded-bl-sm">
                  ・・・
                </p>
              </div>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-4">
              {error}
            </p>
          )}

          {done ? (
            <Link
              href="/diary"
              className="block text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
            >
              一覧画面に戻る
            </Link>
          ) : (
            <form onSubmit={handleSubmit} className="border-t border-gray-100 pt-4">
              <label className="block text-xs font-medium text-gray-500 mb-1">入力フォーム</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={submitting}
                  placeholder="ここに入力してください"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {currentQuestion.field === "unresolved_content" && (
                  <button
                    type="button"
                    onClick={handleSkip}
                    disabled={submitting}
                    className="text-sm text-gray-600 border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors whitespace-nowrap"
                  >
                    なし
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitting || !input.trim()}
                  className="bg-teal-500 hover:bg-teal-600 disabled:bg-teal-200 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
                >
                  送信
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
