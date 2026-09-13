# ユーザープロフィール管理アプリ

ユーザーが会員登録し、性格・特徴タグ付きのプロフィール（アイコン画像・自己紹介・生年月日など）を作成・公開できるアプリです。管理者はユーザー一覧の閲覧・管理を行えます。

## デモ

公開URL: 未公開（ローカル環境での動作確認用リポジトリです）

## 使用技術

| 分類 | 技術 | バージョン |
| --- | --- | --- |
| フロント | Next.js | 15.5.4 |
| フロント | React | 19.2.4 |
| フロント | TypeScript | 5.x |
| フロント | Tailwind CSS | 4.x |
| バック | FastAPI | (requirements.txt 参照) |
| バック | SQLAlchemy / Alembic | (requirements.txt 参照) |
| 認証 | JWT (python-jose) / passlib(bcrypt) | - |
| DB | PostgreSQL | 16 |
| インフラ | Docker / docker-compose | - |

## 環境構築手順

### Docker を使う場合（推奨）

```bash
git clone <このリポジトリのURL>
cd project
docker compose up -d --build
```

- フロントエンド: http://localhost:3001
- バックエンドAPI: http://localhost:8001
- DB（ホストから接続する場合）: localhost:5434

初回起動後、バックエンドコンテナ内でマイグレーションを実行してください。

```bash
docker compose exec backend alembic upgrade head
```

### ローカルで個別に起動する場合

**バックエンド**

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows は venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # DATABASE_URL, SECRET_KEY 等を設定
alembic upgrade head
uvicorn app.main:app --reload --port 8001
```

**フロントエンド**

```bash
cd frontend
npm install
cp .env.local.example .env.local  # NEXT_PUBLIC_API_URL を設定
npm run dev  # http://localhost:3000 (docker利用時は3001)
```

## 使い方

1. トップページで「新規登録」からアカウントを作成
2. ログイン後、プロフィール編集画面で自己紹介・生年月日・アイコン画像・性格/特徴タグを設定
3. トップページでユーザー一覧を確認し、各ユーザーの詳細プロフィールを閲覧

## ディレクトリ構成

```
.
├── backend/
│   └── app/
│       ├── routers/    # APIエンドポイント（user, auth, master）
│       ├── models/     # SQLAlchemy モデル
│       ├── schemas/    # Pydantic スキーマ
│       ├── crud/       # DB操作
│       ├── core/       # 設定・認証・依存性注入
│       └── alembic/    # マイグレーション
├── frontend/
│   └── src/
│       ├── app/         # 画面（ルーティング）
│       ├── components/  # UI部品
│       ├── hooks/       # カスタムフック（useAuth 等）
│       ├── context/     # React Context
│       └── lib/         # API通信・共通処理
├── docker-compose.yml
└── README.md
```

## 今後の課題

- [ ] テストコードの追加
- [ ] スマホ表示の最適化
- [ ] 管理者向け機能の拡充
