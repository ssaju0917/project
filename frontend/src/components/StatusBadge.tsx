import { TaskStatus } from "@/types/diary";

const STYLES: Record<TaskStatus, string> = {
  未解決: "bg-red-50 text-red-700 border border-red-200",
  対応中: "bg-amber-50 text-amber-700 border border-amber-200",
  解決済: "bg-green-50 text-green-700 border border-green-200",
};

export default function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${STYLES[status]}`}
    >
      {status}
    </span>
  );
}
