import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 未ログインでもアクセスできるパス（これ以外はすべてログイン必須）
const PUBLIC_PATHS = ["/login", "/register"];

export default function middleware(request: NextRequest) {
  console.log("middleware 実行:", request.nextUrl.pathname);   // ← 一時的に追加
  const token = request.cookies.get("access_token");
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  // 未ログインで、公開ページ以外にアクセスした場合はログイン画面へ
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ログイン済みでログイン画面・新規登録画面を開いた場合はプロフィールへ
  if (token && isPublic) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // 静的ファイル（_next配下、画像、faviconなど）以外のすべてのパスで実行する
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};