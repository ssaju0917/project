"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function SideMenu() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  const items = [
    { label: "プロフィール", href: `/users/${user.id}` },
    { label: "タスク一覧", href: "/tasks" },
  ];

  return (
    <nav className="w-full sm:w-48 shrink-0 bg-white border border-gray-200 rounded-xl p-4 h-fit">
      <ul className="space-y-2">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block text-sm rounded-lg px-3 py-2 transition-colors ${
                  active
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-blue-600 hover:bg-gray-50 hover:underline"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
