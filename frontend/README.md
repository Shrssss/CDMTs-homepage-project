# ホームページプロジェクト フロントエンド

法政大学多摩キャンパスのプログラミングサークル **CODE MATES** のホームページ（フロントエンド）です。
公開ページ（トップ・記事・メンバー・紹介・お問い合わせ）と、ログイン後に使う部員向け管理ページ（備品・メンバー・技術）で構成されています。

## 技術スタック

| 分類 | 使用ライブラリ |
| --- | --- |
| フレームワーク | Next.js 16（App Router）/ React 19 / TypeScript |
| ビルド形式 | 静的エクスポート（SSG, `output: "export"`） |
| スタイル | Tailwind CSS v4 / shadcn/ui（`radix-nova` スタイル）/ tw-animate-css |
| アイコン | lucide-react（一部 @phosphor-icons/react） |
| データ取得 | TanStack Query v5 / axios |
| スキーマ検証 | zod v4（APIレスポンスを `parse` して型を保証） |
| URL状態管理 | nuqs（検索条件・ページ番号をクエリパラメータで保持） |
| 日付 | date-fns |
| APIモック | MSW v2（開発時のみ） |

## セットアップ

```bash
npm install
```

```bash
npm run dev
```

http://localhost:3000 で開発サーバーが起動します。

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 静的ファイルを `out/` に出力 |
| `npm run start` | 本番サーバー起動 |
| `npm run lint` | ESLint |

### 環境変数

`.env.development.local` などに設定します（`.env*` は git 管理外）。

| 変数名 | 内容 | 既定値 |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | バックエンドAPIのベースURL | `http://localhost:8080/api` |
| `NEXT_PUBLIC_API_MOCKING` | `enabled` にすると開発時に MSW でAPIをモックする | 未設定（無効） |

## ディレクトリ構成

```
frontend/
├── app/                    # ページ（App Router）
│   ├── layout.tsx          # ルートレイアウト（フォント・NuqsAdapter・タイトルテンプレート）
│   ├── globals.css         # Tailwind / shadcn のテーマ・ブランドカラー
│   ├── QueryClientProvider.tsx  # TanStack Query の Provider（MSW の起動待ちも担当）
│   ├── page.tsx            # トップページ
│   ├── NewsClient.tsx      # トップページの最新記事
│   ├── about/              # CODE MATESとは
│   ├── contact/            # お問い合わせ・よくある質問
│   ├── news/               # 記事一覧（検索・カテゴリ絞り込み・ページング）
│   ├── news-detail/        # 記事詳細（?id=記事ID）
│   ├── members/            # メンバー一覧（名前・学年で絞り込み）
│   ├── login/              # ログイン
│   └── login_required/     # ログイン後の管理ページ
│       ├── LoginRequiredHeader.tsx  # 管理ページ用ナビ・ログアウト
│       ├── items/          # 備品一覧・詳細（無限スクロール）
│       ├── members/        # メンバー一覧
│       └── technologies/   # 技術一覧
├── components/
│   ├── header.tsx / Footer.tsx  # 共通ヘッダー・フッター
│   ├── News.tsx / Member.tsx    # 記事カード・メンバーカード
│   ├── brand/              # サイト独自デザインの部品
│   └── ui/                 # shadcn/ui のコンポーネント
├── hooks/                  # TanStack Query のカスタムフック（useQuery / useMutation）
├── lib/
│   ├── features/           # API呼び出し関数（axios）
│   ├── types/api.ts        # テーブル型・レスポンスの zod スキーマ
│   └── utils.ts            # cn() など
├── mocks/                  # MSW のハンドラーとインメモリDB
├── note/                   # 開発メモ（JSXの書き方の注意点など）
└── public/                 # 画像・mockServiceWorker.js
```

## ページ一覧

| パス | 内容 | 主なデータ |
| --- | --- | --- |
| `/` | トップ（ファーストビュー・活動の3つの柱・初心者歓迎・活動日/場所・最新のお知らせ） | `GET /news` |
| `/news` | 記事一覧。キーワード検索・カテゴリ絞り込み・ページング（`?keyword=&category=&page=`） | `GET /news` |
| `/news-detail?id=` | 記事詳細 | `GET /news/{id}` |
| `/members` | メンバー一覧。名前・学年で絞り込み（`?name=&grade=&page=`） | `GET /members` |
| `/about` | CODE MATES の紹介・活動内容・入部案内 | 静的 |
| `/contact` | 連絡先・活動日/場所・よくある質問 | 静的 |
| `/login` | ログイン（学籍番号またはメールアドレス＋パスワード）。成功後 `/login_required/items` へ | `POST /auth/login` |
| `/login_required/items` | 備品一覧（名前・保管場所・消耗品・貸出可で絞り込み）と詳細 | `GET /items`, `GET /items/{id}` |
| `/login_required/members` | メンバー一覧 | `GET /members` |
| `/login_required/technologies` | 技術一覧 | `GET /technologies` |

静的エクスポートのため動的ルート（`/news/[id]` など）は使わず、詳細ページはクエリパラメータで対象を指定しています。
ページのタイトルは `layout.tsx` のテンプレートで `<ページ名> - CODE MATES -` になります。

## 設計方針

### データ取得の流れ

```
ページ (page.tsx, サーバーコンポーネント)
  └─ Provider (QueryClientProvider)
       └─ *Client.tsx ("use client")
            └─ hooks/*.ts           … useQuery / useInfiniteQuery / useMutation
                 └─ lib/features/*.ts  … axiosInstance でAPIを呼び、zod で parse
```

- `page.tsx` はレイアウトとメタデータだけを持ち、データを使う部分は `*Client.tsx` に分けています。
- `useQueryState`（nuqs）や `useSearchParams` を使うコンポーネントは `<Suspense>` で囲みます（静的エクスポートのビルドに必要）。
- `axiosInstance`（`lib/features/api.ts`）は `withCredentials: true` で Cookie によるセッションを送ります。配列パラメータは `grades=1&grades=2` 形式で送ります（Spring の `List<…>` に合わせるため）。
- 一覧APIは総件数を返さないため、ページングは「前へ/次へ＋現在ページ」のみ。1ページの件数はバックエンドと合わせて 20 件です。備品・技術は `useInfiniteQuery` で、空配列が返るまで次ページを読み込みます。
- Next.js の `<Image />` は静的エクスポートで使えないため、画像は `<img>` を使っています。

### API 一覧（`lib/features`）

| リソース | エンドポイント |
| --- | --- |
| 認証 | `POST /auth`（作成）, `POST /auth/login`, `POST /auth/logout`, `POST /auth/{id}/passUpdate`, `GET /auth/me`, `GET /auth`（未承認一覧）, `PATCH /auth/{id}/approve`, `PATCH /auth/admin/{id}?role=` |
| メンバー | `GET /members`, `GET /members/{id}`, `PUT /members/{id}` |
| 記事 | `GET /news`, `GET /news/{id}`, `POST /news`, `PUT /news/{id}`, `PATCH /news/{id}/published`, `POST /news/thumbnail` |
| 技術 | `GET /technologies`, `GET /technologies/{id}`, `GET /technologies/{id}/members`, `POST /technologies`, `PUT /technologies/{id}`, `DELETE /technologies/{id}` |
| 備品 | `GET /items`, `GET /items/{id}`, `GET /items/{id}/history`, `POST /items`, `PUT /items/{id}`, `PUT /items/rent/{id}`, `PUT /items/return/{id}`, `PUT /items/Availability/{id}/{isRentable}` |

レスポンスの形は `lib/types/api.ts` の `*ResponseSchema` で定義しています。バックエンドの `LocalDateTime`（タイムゾーンなしのISO文字列）は `Date` に変換されます。

### デザイン

- ブランドカラーは `app/globals.css` で定義し、Tailwind のクラスとして使えます。

  | クラス | 色 |
  | --- | --- |
  | `brand-beige` | `#EDE6DA`（背景） |
  | `brand-black` | `#11110F`（文字・枠線） |
  | `brand-sky` | `#95c7ce` |
  | `brand-emerald` | `#7dcebb` |
  | `brand-gray` | `#e4efef` |

- `components/brand/` にサイト独自の部品があります。

  | コンポーネント | 用途 |
  | --- | --- |
  | `SectionMarker` | `[01] ───── WHAT WE DO` 形式のセクション見出し |
  | `TerminalWindow` | ターミナル風の装飾ウィンドウ |
  | `InfoGrid` | 活動日・場所などの枠線付きグリッド |
  | `FilterChips` | 絞り込み用トグルボタン列 |
  | `SearchField` | 送信ボタン付き検索欄 |
  | `Pagination` | 前後移動のページネーション |
  | `StatusPanels` | 読み込み中・エラー・0件の表示 |

- 汎用UIは shadcn/ui（`components/ui/`）を使います。追加は `npx shadcn add <name>`。
- レスポンシブは `md`（768px）を境にスマホ／PCを切り替えます。ヘッダーは768px未満でハンバーガーメニューになります。

## MSW によるAPIモック

バックエンドを起動しなくても画面を確認できるよう、MSW でAPIをモックできます。

1. `.env.development.local` に `NEXT_PUBLIC_API_MOCKING=enabled` を書く
2. `npm run dev` で起動する

- 有効になるのは `NODE_ENV=development` のときだけです。
- `QueryClientProvider` が Service Worker の起動を待ってから描画するので、最初のリクエストも確実にモックされます。
- データは `mocks/db.ts` のインメモリDBにあり、書き込み系のリクエストで更新されます。リロードすると初期状態に戻ります。
- ログインは学籍番号（例: `24000001`）またはメールアドレス（例: `member1@example.com`）と、全員共通のパスワード `password` で行えます。
- `member1@example.com` は管理者です。`member24`〜`member26` は承認待ちのため、承認するまでログインできません。
- ログイン状態は `sessionStorage` に保存するので、リロードしてもタブを閉じるまでは残ります。
- ハンドラーは `mocks/handlers.ts`。APIを追加・変更したら、ここも `lib/types/api.ts` のスキーマに合わせて更新してください。

## 現状と TODO

- トップ・お問い合わせ・紹介ページに `TODO` コメントで未確定の文言（キャッチコピー・理念・FAQの回答など）が残っています。
- 記事カテゴリは仮の値（`お知らせ / 活動報告 / イベント / LT会`）です。
- `login_required/` 配下は `AuthGuard` が `GET /auth/me` でログイン状態を確認し、未ログインなら `/login` へ移動させます。
- 管理者かどうかは `GET /auth`（管理者以外は403）が成功するかで判定しています。現在のロールを返すAPIはありません。
- `app/MembersClient.tsx` は現在どこからも使われていません（メンバー一覧は `app/members/MembersClient.tsx`）。

## 参考

- `note/React未修得者むけ，JSXを書くときに注意すること.md` — React に慣れていない人向けの JSX の注意点
