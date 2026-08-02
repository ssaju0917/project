import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 未ログインでもアクセスできるパス（これ以外はすべてログイン必須）
const PUBLIC_PATHS = ["/login", "/register"];

// 管理者専用ページ（一般ユーザーはURL直叩きでもアクセス不可）
const ADMIN_ONLY_PATHS = ["/"];

// middleware はフロントのコンテナ内で実行されるため、ブラウザ向けの
// NEXT_PUBLIC_API_URL（localhost経由）ではなくDocker内部DNSでバックエンドに到達する
const INTERNAL_API_URL = process.env.INTERNAL_API_URL || "http://backend:8001";

async function isAdminToken(token: string): Promise<boolean> {
  try {
    const res = await fetch(`${INTERNAL_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return false;
    const user = await res.json();
    return user.permission_level === 2;
  } catch {
    return false;
  }
}

export default async function middleware(request: NextRequest) {
  console.log("middleware 実行:", request.nextUrl.pathname);   // ← 一時的に追加
  const token = request.cookies.get("access_token");
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  // 未ログインで、公開ページ以外にアクセスした場合はログイン画面へ
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ログイン済みでログイン画面・新規登録画面を開いた場合は日記トップへ
  if (token && isPublic) {
    return NextResponse.redirect(new URL("/diary", request.url));
  }

  // 管理者専用ページは、管理者権限を持つユーザーのみ表示可能
  if (token && ADMIN_ONLY_PATHS.includes(pathname)) {
    const isAdmin = await isAdminToken(token.value);
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/diary", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // 静的ファイル（_next配下、画像、faviconなど）以外のすべてのパスで実行する
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};