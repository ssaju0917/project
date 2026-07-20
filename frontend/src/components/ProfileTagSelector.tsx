"use client";

/**
 * プロフィール編集画面 - 性格・特徴タグ選択コンポーネント
 *
 * 「性格」「特徴」など、マスタの選択肢から最大 max 件までタグを選べる controlled コンポーネントです。
 * 選択済みタグは色付き・チェックマーク、未選択タグは白背景・＋アイコンで表示します。
 * 選択状態（IDの配列）と選択肢一覧は親コンポーネントから受け取ります。
 */

type TagOption = {
  id: number;
  name: string;
};

type Props = {
  label: string;
  options: TagOption[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  max: number;
  color: "blue" | "green";
  loading?: boolean;
};

const COLOR_STYLES: Record<
  Props["color"],
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

export default function ProfileTagSelector({
  label,
  options,
  selectedIds,
  onChange,
  max,
  color,
  loading,
}: Props) {
  const style = COLOR_STYLES[color];
  const isFull = selectedIds.length >= max;

  const toggleTag = (id: number) => {
    const isSelected = selectedIds.includes(id);

    if (isSelected) {
      onChange(selectedIds.filter((i) => i !== id));
      return;
    }

    // 最大数に達している場合は追加しない
    if (selectedIds.length >= max) return;

    onChange([...selectedIds, id]);
  };

  return (
    <section className={`rounded-xl border p-5 ${style.panel}`}>
      <h3 className={`mb-3 text-sm font-bold ${style.heading}`}>
        {label}
        <span className="ml-1 font-normal text-gray-500">
          （最大{max}つまで選択可）
        </span>
      </h3>

      {loading ? (
        <p className="text-sm text-gray-400">選択肢を読み込み中...</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {options.map((option) => {
              const isSelected = selectedIds.includes(option.id);
              const disabled = !isSelected && isFull;

              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => toggleTag(option.id)}
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
                  {option.name}
                </button>
              );
            })}
          </div>

          <p className="mt-3 text-xs text-gray-500">
            選択中：
            <span className={`font-semibold ${style.count}`}>
              {selectedIds.length}
            </span>
            {" "}/ {max}
          </p>
        </>
      )}
    </section>
  );
}
