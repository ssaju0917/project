"use client";
import UserCard from "@/components/UserCard";
import UserList from "@/components/UserList";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user, loading, logout } = useAuth();
  console.log("mainの内容");
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {user && user.permission_level !== 2 ? (
          <div className="rounded-lg px-4 py-3 mb-6">
            <UserCard
              user={user}
              showEditButton={false}
            />
          </div>
        ): (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-8">ユーザー管理</h1>
            <UserList />
          </div>
        )}  
      </div>
    </main>
  );
}