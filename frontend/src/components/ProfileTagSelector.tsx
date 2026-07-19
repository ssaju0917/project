"use client";

import { useState } from "react";

/**
 * プロフィール編集画面 - 性格・特徴タグ選択コンポーネント
 *
 * 「性格」「特徴」それぞれ最大5つまでタグを選択できるUIです。
 * 選択済みタグは色付き・チェックマーク、未選択タグは白背景・＋アイコンで表示します。
 */

type TagGroupConfig = {
  key: string;
  label: string; // 見出し (例: 性格)
  options: string[]; // 選択肢の一覧
  max: number; // 最大選択数
  color: "blue" | "green";
};

const TAG_GROUPS: TagGroupConfig[] = [
  {
    key: "personality",
    label: "性格",
    options: ["協調性がある", "慎重", "好奇心旺盛", "論理的", "粘り強い", "楽観的"],
    max: 5,
    color: "blue",
  },
  {
    key: "trait",
    label: "特徴",
    options: ["リーダー経験", "留学経験", "資格保有", "副業経験", "登壇経験"],
    max: 5,
    color: "green",
  },
];

const COLOR_STYLES: Record<
  TagGroupConfig["color"],
  { panel: string; heading: string; selected: string; count: string }
> = {
  blue: {
    panel: "bg-blue-50 border-blue-100",
    heading: "text-blue-700",
    selected: "bg-blue-600 text-white border-blue-600 hover:bg-blue-700",
    count: "text-blue-700",
  },
  green: {
    panel: "bg-green-50 border-green-100",
    heading: "text-green-700",
    selected: "bg-green-700 text-white border-green-700 hover:bg-green-800",
    count: "text-green-700",
  },
};

export default function ProfileTagSelector() {
  // group.key -> 選択中タグの配列
  const [selections, setSelections] = useState<Record<string, string[]>>(
    () =>
      Object.fromEntries(TAG_GROUPS.map((g) => [g.key, []])) as Record<
        string,
        string[]
      >
  );

  const toggleTag = (group: TagGroupConfig, tag: string) => {
    setSelections((prev) => {
      const current = prev[group.key];
      const isSelected = current.includes(tag);

      if (isSelected) {
        return { ...prev, [group.key]: current.filter((t) => t !== tag) };
      }

      // 最大数に達している場合は追加しない
      if (current.length >= group.max) {
        return prev;
      }

      return { ...prev, [group.key]: [...current, tag] };
    });
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      {TAG_GROUPS.map((group) => {
        const style = COLOR_STYLES[group.color];
        const selected = selections[group.key];
        const isFull = selected.length >= group.max;

        return (
          <section
            key={group.key}
            className={`rounded-xl border p-5 ${style.panel}`}
          >
            <h3 className={`mb-3 text-sm font-bold ${style.heading}`}>
              {group.label}
              <span className="ml-1 font-normal text-gray-500">
                （最大{group.max}つまで選択可）
              </span>
            </h3>

            <div className="flex flex-wrap gap-2">
              {group.options.map((tag) => {
                const isSelected = selected.includes(tag);
                const disabled = !isSelected && isFull;

                return (
                  <button
                    key={tag}
                    type="button"
                    disabled={disabled}
                    onClick={() => toggleTag(group, tag)}
                    aria-pressed={isSelected}
                    className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors
                      ${
                        isSelected
                          ? style.selected
                          : disabled
                          ? "cursor-not-allowed border-gray-200 bg-white text-gray-300"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    <span aria-hidden="true">{isSelected ? "✓" : "＋"}</span>
                    {tag}
                  </button>
                );
              })}
            </div>

            <p className="mt-3 text-xs text-gray-500">
              選択中：
              <span className={`font-semibold ${style.count}`}>
                {selected.length}
              </span>
              {" "}/ {group.max}
            </p>
          </section>
        );
      })}
    </div>
  );
}