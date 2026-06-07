# デジタル名刺アプリ

IDを使って自分の名刺を作成・共有できるWebアプリです。

## 機能

- **トップページ**: IDを入力して他のユーザーの名刺を閲覧
- **名刺ページ**: 名前・自己紹介・好きな技術・SNSリンクを表示
- **新規登録**: 好きな英単語をIDにして名刺を登録

## 技術スタック

| カテゴリ       | 技術                         |
| -------------- | ---------------------------- |
| フロントエンド | React 19 + TypeScript + Vite |
| UI             | Chakra UI                    |
| ルーティング   | React Router                 |
| フォーム       | React Hook Form              |
| BaaS           | Supabase                     |
| ホスティング   | Firebase                     |

## 画面構成

| パス              | 画面     | 説明                   |
| ----------------- | -------- | ---------------------- |
| `/`               | トップ   | IDを入力して名刺を検索 |
| `/cards/:id`      | 名刺表示 | 指定IDの名刺を表示     |
| `/cards/register` | 新規登録 | 名刺を新規作成         |

## セットアップ

### 1. リポジトリをクローン

```bash
git clone https://github.com/your-username/digital-business-card.git
cd digital-business-card
```

### 2. 依存パッケージをインストール

```bash
npm install
```

### 3. 環境変数を設定

`.env_template` をコピーして `.env` を作成し、Supabaseの接続情報を入力します。

```bash
cp .env_template .env
```

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# バッチ処理用（ローカル実行時に使用。VITE_ と同じ値でOK）
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. GitHub Secrets を設定

GitHub Actions でビルド・デプロイ・バッチ処理を動かすために、リポジトリの **Settings > Secrets and variables > Actions** に以下を登録してください。

| Secret 名                | 説明                                                    |
| ------------------------ | ------------------------------------------------------- |
| `VITE_SUPABASE_URL`      | Supabase の Project URL（ビルド用）                     |
| `VITE_SUPABASE_ANON_KEY` | Supabase の anon キー（ビルド用）                       |
| `SUPABASE_URL`           | Supabase の Project URL（バッチ用）                     |
| `SUPABASE_ANON_KEY`      | Supabase の anon キー（バッチ用）                       |
| `FIREBASE_KEY`           | Firebase サービスアカウントキー（Base64エンコード済み） |
| `FIREBASE_TOKEN`         | Firebase CLI トークン                                   |

### 5. Supabaseのテーブル構成

以下のテーブルをSupabaseで作成してください。

**users**
| カラム | 型 | 備考 |
|---|---|---|
| id | text | PRIMARY KEY（ユーザーが入力した英単語） |
| name | text | |
| description | text | |
| github_id | text | nullable |
| qiita_id | text | nullable |
| x_id | text | nullable |
| created_at | timestamptz | DEFAULT now() |

**skills**
| カラム | 型 | 備考 |
|---|---|---|
| id | int8 | PRIMARY KEY |
| name | text | |
| created_at | timestamptz | DEFAULT now() |

**user_skill**
| カラム | 型 | 備考 |
|---|---|---|
| id | int8 | PRIMARY KEY |
| user_id | text | REFERENCES users(id) |
| skill_id | int8 | REFERENCES skills(id) |
| created_at | timestamptz | DEFAULT now() |

### 6. 開発サーバーを起動

```bash
npm run dev
```

## バッチ処理

毎朝 6 時（JST）に GitHub Actions のクーロンジョブが自動実行され、当日より前に作成されたすべてのユーザーデータ（`users` / `user_skill`）を削除します。

### 仕組み

- スケジュール: `0 21 * * *`（UTC 21:00 = JST 06:00）
- ワークフローファイル: `.github/workflows/batch.yml`
- 実行コマンド: `npx tsx ./batch/index.ts`
- 削除順序: `user_skill` → `users`（FK 制約対応）

### 手動実行

GitHub リポジトリの **Actions** タブ → `Daily batch - delete previous day data` → **Run workflow** から手動実行できます。

### ローカルで実行する場合

`.env` に `SUPABASE_URL` / `SUPABASE_ANON_KEY` を設定した上で：

```bash
npx tsx ./batch/index.ts
```

## コマンド

```bash
npm run dev                  # 開発サーバー起動
npm run build                # プロダクションビルド
npm run lint                 # ESLintチェック
npm run test                 # テスト実行
npx tsx ./batch/index.ts     # 前日以前のデータを手動削除（要 .env 設定）
```
