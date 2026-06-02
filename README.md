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
```

### 4. Supabaseのテーブル構成

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

### 5. 開発サーバーを起動

```bash
npm run dev
```

## コマンド

```bash
npm run dev        # 開発サーバー起動
npm run build      # プロダクションビルド
npm run lint       # ESLintチェック
npm run test       # テスト実行
```
