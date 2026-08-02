"use client";

import { TaskStatusSummary } from "@/types/diary";

type Props = {
  summary: TaskStatusSummary;
};

const SIZE = 96;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function TaskStatusDonut({ summary }: Props) {
  const { resolved, in_progress, unresolved, total } = summary;

  const segments = [
    { key: "resolved", label: "解決済", value: resolved, cssVar: "--status-good" },
    { key: "in_progress", label: "対応中", value: in_progress, cssVar: "--status-warning" },
    { key: "unresolved", label: "未解決", value: unresolved, cssVar: "--status-critical" },
  ];

  let offset = 0;

  return (
    <div className="task-status-donut flex items-center gap-4">
      <style>{`
        .task-status-donut {
          --status-good: #0ca30c;
          --status-warning: #fab219;
          --status-critical: #d03b3b;
          --track: #e1e0d9;
          --text-secondary: #52514e;
        }
        @media (prefers-color-scheme: dark) {
          :root:where(:not([data-theme="light"])) .task-status-donut {
            --track: #2c2c2a;
            --text-secondary: #c3c2b7;
          }
        }
        :root[data-theme="dark"] .task-status-donut {
          --track: #2c2c2a;
          --text-secondary: #c3c2b7;
        }
      `}</style>

      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label={`解決済 ${resolved}件、対応中 ${in_progress}件、未解決 ${unresolved}件`}
      >
        <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--track)"
            strokeWidth={STROKE}
          />
          {total > 0 &&
            segments
              .filter((s) => s.value > 0)
              .map((s) => {
                const length = (s.value / total) * CIRCUMFERENCE;
                const dasharray = `${length} ${CIRCUMFERENCE - length}`;
                const dashoffset = -offset;
                offset += length;
                return (
                  <circle
                    key={s.key}
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={RADIUS}
                    fill="none"
                    stroke={`var(${s.cssVar})`}
                    strokeWidth={STROKE}
                    strokeDasharray={dasharray}
                    strokeDashoffset={dashoffset}
                  >
                    <title>
                      {s.label}: {Math.round((s.value / total) * 100)}% ({s.value}件)
                    </title>
                  </circle>
                );
              })}
        </g>
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-gray-900"
          style={{ fontSize: 18, fontWeight: 600 }}
        >
          {total}
        </text>
      </svg>

      <ul className="space-y-1 text-xs">
        {segments.map((s) => (
          <li key={s.key} className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: `var(${s.cssVar})` }}
            />
            <span style={{ color: "var(--text-secondary)" }}>
              {s.label}：{total > 0 ? Math.round((s.value / total) * 100) : 0}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
