# Homepage システム設計書

## 1. 概要

本システムは、団体（サークル・研究会等）のホームページを支えるバックエンドAPIである。以下5つの業務ドメインを扱う。

- **会員管理（Member）**：会員情報の検索・詳細表示・更新（習得技術の紐付けを含む）
- **認証（Auth）**：会員登録・ログイン・ログアウト・パスワード変更・会員の承認／権限変更（管理者）・ログイン中会員ID取得
- **備品管理（Item）**：備品の登録・検索・貸出／返却・貸出履歴管理
- **お知らせ管理（News）**：活動報告記事の投稿・検索・公開管理・サムネイル画像アップロード
- **技術管理（Technology）**：習得技術の登録・会員との紐付け管理

会員登録は**管理者承認制**である。登録直後のアカウントは未承認（`is_approved = FALSE`）で、管理者（`role = 'ADMIN'`）が承認するまでログインできない。

### 1.1 技術スタック

| 分類 | 技術 | バージョン |
|---|---|---|
| 言語 | Java | 21 |
| フレームワーク | Spring Boot | 3.5.15 |
| ビルドツール | Gradle | 8.14.5（Wrapper） |
| O/Rマッパー | MyBatis (mybatis-spring-boot-starter) | 3.0.5 |
| DB | PostgreSQL | - |
| 認証 | Spring Security（セッション方式） | - |
| バリデーション | spring-boot-starter-validation (Jakarta Validation) | - |
| 補助ライブラリ | Lombok、Spring Boot DevTools（開発時のみ） | - |
| ファイル保存 | ローカルディスク（`file.upload-dir`） | - |

### 1.2 アーキテクチャ

レイヤードアーキテクチャを採用し、責務を以下のように分離する。

```
Controller層 → Service層 → Mapper層（MyBatis） → DB
     ↑              ↓
   DTO変換      Entity操作／業務ロジック
```

- **Controller**：HTTPリクエストの受付とDTOへの変換、Serviceへの処理委譲のみを行う。業務処理は行わない。
- **Service**：業務ロジック、Entity⇔DTO変換、トランザクション制御（`@Transactional`）を担当する。
- **Mapper（MyBatis Mapper Interface + XML）**：DBアクセスのみを担当する。
- **Entity**：テーブルの1レコードに対応するオブジェクト。
- **DTO**：リクエスト／レスポンス用オブジェクト。`toEntity()`によりEntity変換を行うものがある。

---

## 2. データベース設計

DDLは `src/main/resources/db/schema.sql`。

### 2.1 ER概要

```
members ──< items (renter_id)
members ──< item_rental_histories (renter_id)
items   ──< item_rental_histories (item_id)
members ──< member_technologies >── technologies
```

### 2.2 テーブル定義

#### members（会員）

| カラム | 型 | 制約 | 説明 |
|---|---|---|---|
| id | BIGSERIAL | PK | 会員ID |
| name | VARCHAR(50) | NOT NULL | 氏名 |
| student_id | VARCHAR(7) | NOT NULL, UNIQUE | 学籍番号（例: `12A3456`） |
| email | VARCHAR(255) | NOT NULL, UNIQUE | メールアドレス |
| grade | SMALLINT | NOT NULL | 学年（1〜4） |
| position | VARCHAR(50) | | 役職 |
| password_hash | VARCHAR(255) | NOT NULL | パスワードハッシュ（BCrypt） |
| is_approved | BOOLEAN | NOT NULL, DEFAULT FALSE | 承認済みフラグ（未承認はログイン不可） |
| role | VARCHAR(20) | NOT NULL, DEFAULT 'MEMBER' | 権限（`MEMBER` / `ADMIN`）。管理者が`PATCH /api/auth/admin/{id}`で変更する |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 登録日時 |
| updated_at | TIMESTAMP | | 更新日時（会員情報更新時に`CURRENT_TIMESTAMP`を設定。登録直後はNULL） |

#### items（備品）

| カラム | 型 | 制約 | 説明 |
|---|---|---|---|
| id | BIGSERIAL | PK | 備品ID |
| name | VARCHAR(100) | NOT NULL | 備品名 |
| description | VARCHAR(255) | NOT NULL | 説明 |
| storage_location | VARCHAR(100) | NOT NULL | 保管場所 |
| quantity | SMALLINT | NOT NULL | 在庫数（貸出で-1、返却で+1） |
| is_disposable | BOOLEAN | NOT NULL, DEFAULT FALSE | 消耗品フラグ |
| is_rentable | BOOLEAN | NOT NULL, DEFAULT FALSE | 貸出可否フラグ（在庫0になると自動でFALSE、返却でTRUE） |
| renter_id | BIGINT | FK → members(id), ON DELETE SET NULL | 直近の借主ID（貸出で設定、返却でNULL） |
| rented_at | TIMESTAMP | | 直近の貸出日時（貸出で現在時刻を設定、返却でNULL） |

#### item_rental_histories（貸出履歴）

| カラム | 型 | 制約 | 説明 |
|---|---|---|---|
| id | BIGSERIAL | PK | 履歴ID |
| item_id | BIGINT | NOT NULL, FK → items(id), ON DELETE CASCADE | 備品ID |
| renter_id | BIGINT | NOT NULL, FK → members(id), ON DELETE CASCADE | 借主ID |
| rented_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 貸出日時 |
| returned_at | TIMESTAMP | | 返却日時（NULL＝貸出中） |

#### news（活動報告）

| カラム | 型 | 制約 | 説明 |
|---|---|---|---|
| id | BIGSERIAL | PK | ニュースID |
| title | VARCHAR(100) | NOT NULL | タイトル |
| content | TEXT | NOT NULL | 本文 |
| thumbnail_path | VARCHAR(255) | | サムネイル画像パス（例: `/uploads/news/{UUID}.png`） |
| category | VARCHAR(30) | NOT NULL | カテゴリ |
| is_published | BOOLEAN | NOT NULL, DEFAULT FALSE | 公開フラグ |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 投稿日時 |
| updated_at | TIMESTAMP | | 更新日時（記事更新時に設定） |

#### technologies（技術）

| カラム | 型 | 制約 | 説明 |
|---|---|---|---|
| id | BIGSERIAL | PK | 技術ID |
| name | VARCHAR(50) | NOT NULL | 技術名 |
| description | VARCHAR(255) | NOT NULL | 詳細説明 |

#### member_technologies（会員×技術：中間テーブル）

| カラム | 型 | 制約 | 説明 |
|---|---|---|---|
| member_id | BIGINT | PK(複合), FK → members(id), ON DELETE CASCADE | 会員ID |
| technology_id | BIGINT | PK(複合), FK → technologies(id), ON DELETE CASCADE | 技術ID |

---

## 3. パッケージ構成

```
net.codemates.homepage
├── HomepageApplication.java         起動クラス
├── config/
│   ├── SecurityConfig.java          Spring Security設定（CORS, 認可, ログアウト）
│   └── WebMvcConfig.java            /uploads/** をアップロードディレクトリにマッピング
├── controller/
│   ├── AuthController.java          /api/auth
│   ├── MemberController.java        /api/members
│   ├── ItemController.java          /api/items
│   ├── NewsController.java          /api/news
│   └── TechnologyController.java    /api/technologies
├── service/
│   ├── AuthService.java
│   ├── MemberService.java
│   ├── ItemService.java
│   ├── NewsService.java
│   ├── TechnologyService.java
│   └── ThumbnailStorageService.java サムネイル画像の検証・保存
├── mapper/                          MyBatis Mapperインターフェース
│   ├── MemberMapper.java
│   ├── ItemMapper.java
│   ├── ItemRentalHistoryMapper.java
│   ├── NewsMapper.java
│   ├── TechnologyMapper.java
│   └── MemberTechnologyMapper.java
├── model/
│   ├── entity/                      Item, ItemRentalHistory, Member, MemberTechnology, News, Technology
│   └── dto/
│       ├── member/  (CreateRequest, UpdateRequest, LoginRequest, PasswordUpdateRequest, Response, DetailResponse)
│       ├── item/    (CreateRequest, UpdateRequest, RentRequest※未使用, Response, DetailResponse, RentalHistoryResponse)
│       ├── news/    (CreateRequest, UpdateRequest, Response, DetailResponse)
│       └── technology/ (CreateRequest, UpdateRequest, Response, DetailResponse)
├── security/
│   ├── MemberUserDetails.java        UserDetails実装（Memberをラップ。権限は`ROLE_`+role）
│   └── MemberUserDetailsService.java UserDetailsService実装（学籍番号/メールでロード）
└── exception/
    ├── ErrorCode.java                エラーコード定義（HTTPステータス＋メッセージ）
    ├── BusinessException.java        業務例外
    ├── ErrorResponse.java            エラーレスポンスDTO（record）
    ├── GlobalExceptionHandler.java   @RestControllerAdviceによる例外ハンドリング
    └── DbAssertions.java             DB更新件数の検証ユーティリティ
```

リソース配置：`src/main/resources/` 配下に `application.yml`、`db/schema.sql`、`mapper/*.xml`、`static/`（APIテスター `index.html` ほか）。

---

## 4. API設計

### 4.0 共通仕様

- **更新系PUTのリクエストボディには`id`が必須**：`MemberUpdateRequest` / `ItemUpdateRequest` / `NewsUpdateRequest` / `TechnologyUpdateRequest` の`id`は`@NotNull`であり、`@Valid`検証がControllerでのパス変数`id`の上書きより先に行われる。そのためボディにも`id`（パスと同じ値）を含める必要がある。なお、パスワード変更（`MemberPasswordUpdateRequest`）は`id`を持たず、パス変数のみを使用する。
- **ページング**：`page`は1始まり（デフォルト1）、1ページ20件固定。0以下・未指定は1ページ目として扱う（全APIで共通）。
- **並び順**：会員＝氏名順、備品＝備品名順、お知らせ＝投稿日時の新しい順、技術＝IDの新しい順、貸出履歴＝ID昇順。
- **検索の文字列条件**：`ILIKE '%...%'`による部分一致（大文字小文字を区別しない）。
- **バリデーション失敗**：`MethodArgumentNotValidException`は専用ハンドラを持たず、Spring標準の400レスポンスとなる（`ErrorResponse`形式ではない）。

### 4.1 認証 API（`/api/auth`）

| メソッド | パス | 概要 | 認証／認可 | リクエスト | レスポンス |
|---|---|---|---|---|---|
| POST | `/api/auth` | 会員登録（未承認で作成） | 不要 | `MemberCreateRequest` | `Long`（会員ID） |
| POST | `/api/auth/login` | ログイン | 不要 | `MemberLoginRequest` | `Long`（会員ID） |
| POST | `/api/auth/{id}/passUpdate` | パスワード変更 | 必要（本人のみ） | JSONボディ `MemberPasswordUpdateRequest`（`oldPassword`, `newPassword`） | `Long`（会員ID） |
| POST | `/api/auth/logout` | ログアウト | - | - | 200 OK |
| PATCH | `/api/auth/{id}/approve` | 会員の承認 | ADMIN | - | `Long`（会員ID） |
| PATCH | `/api/auth/admin/{id}` | 会員の権限（role）変更 | ADMIN | クエリ `role` | `Long`（会員ID） |
| GET | `/api/auth` | 未承認会員の一覧取得 | ADMIN | - | `List<MemberResponse>` |
| GET | `/api/auth/me` | ログイン中の会員ID取得 | 必要 | - | `Long`（会員ID） |

**会員登録・ログイン仕様**

- パスワードはBCryptでハッシュ化して保存する。登録時は `is_approved = false`、`role = 'MEMBER'` で作成する。
- 学籍番号・メールアドレスの重複はDB検索（`findByStudentIdOrEmail`）によって事前チェックし、重複時は`DUPLICATE_STUDENT_ID` / `DUPLICATE_EMAIL`を返す。
- ログインは学籍番号またはメールアドレス（`identifier`）＋パスワードで行う。Spring Securityの`AuthenticationManager`に処理を委譲し、資格情報不一致は`LOGIN_FAILED`とする。認証成功後に**承認済みか**を確認し、未承認なら`ACCOUNT_NOT_APPROVED`を返す（セッションは作成しない）。承認済みの場合のみ`SecurityContext`をHTTPセッションに保存する（`HttpSessionSecurityContextRepository`）。
- パスワード変更は、ログイン中の本人（`SecurityContextHolder`から取得した`MemberUserDetails`）とパス変数の`id`が一致しない場合`ACCESS_DENIED`を返す。旧パスワードの一致確認（不一致は`PASSWORD_MISMATCH`）後に更新する。`oldPassword` / `newPassword`はJSONボディで受け取り、それぞれ必須・10〜72文字。
- 承認（`approve`）は対象会員の存在確認後、`is_approved = true`に更新する。未承認一覧は`is_approved = FALSE`の会員を返す。
- 権限変更（`PATCH /api/auth/admin/{id}`）は、`role`クエリで受け取った文字列で`members.role`を更新する。`role`は`ADMIN`または`MEMBER`のみ許可し、それ以外は`ROLE_MISMATCH`（400）を返す。更新件数が1件でなければ`UNEXPECTED_DB_STATE`（存在しない会員IDを含む）。

### 4.2 会員 API（`/api/members`）

| メソッド | パス | 概要 | 認証 | クエリ／パラメータ |
|---|---|---|---|---|
| GET | `/api/members` | 会員検索・一覧取得（承認済み会員のみ） | 不要 | `name`, `grades`, `positions`, `page`（デフォルト1） |
| GET | `/api/members/{id}` | 会員詳細取得（習得技術一覧含む） | 必要 | - |
| PUT | `/api/members/{id}` | 会員情報更新（技術紐付けも一括更新） | 必要 | `MemberUpdateRequest` |

- 会員検索は`is_approved = TRUE`の会員のみを返す。`grades` / `positions`はIN検索（複数指定可）。
- 会員更新では`name`, `student_id`, `email`, `grade`, `position`, `updated_at`を更新し、`member_technologies`をいったん全削除した上で、リクエストの`technologyIds`を再登録する（洗い替え方式。`technologyIds`が`null`の場合は紐付けが全て削除される）。

### 4.3 備品 API（`/api/items`）

全て認証必須。

| メソッド | パス | 概要 |
|---|---|---|
| POST | `/api/items` | 備品登録 |
| PUT | `/api/items/{id}` | 備品更新 |
| GET | `/api/items/{id}` | 備品詳細取得（存在しないIDは`ITEM_NOT_FOUND`） |
| GET | `/api/items` | 備品検索・一覧取得（`name`, `storageLocation`, `isDisposable`, `isRentable`, `page`） |
| GET | `/api/items/{id}/history` | 貸出履歴取得（`page`） |
| PUT | `/api/items/rent/{id}/{renterId}` | 貸出処理 |
| PUT | `/api/items/return/{id}/{renterId}` | 返却処理 |
| PUT | `/api/items/Availability/{id}/{isRentable}` | 貸出可否切替 |

> 検索パラメータ名は`storageLocation`（`strageLocation`ではない）。複数指定可（`List<String>`、IN検索）。

**貸出／返却の業務ロジック**

- 貸出（`updateByRenting`）：`is_rentable = true` かつ `quantity - 1 >= 0` の備品に限り、`renter_id`を設定し、`rented_at`を現在時刻にし、`quantity`を1減らす。減算後の在庫が0になる場合は`is_rentable`を`false`にする。更新件数が1件でなければ`ITEM_NOT_RENTABLE`。成功時は`item_rental_histories`へ新規レコードを1件INSERTする（`rented_at`はDB側`CURRENT_TIMESTAMP`）。複数在庫の備品は、在庫がある限り別の会員も借りられる。
- 返却（`updateByReturning`）：`id`のみを条件に`renter_id`と`rented_at`をNULLにし、`quantity`を1増やし、`is_rentable`を`true`にする。続いて、`item_id`・`renter_id`が一致し`returned_at IS NULL`の履歴（`rented_at`が最新の1件）を検索し、見つからなければ`NO_ACTIVE_RENTAL`をスローする（`@Transactional`によりUPDATEもロールバックされる）。見つかれば`returned_at`を現在時刻に更新する。借主の一致確認はこの履歴検索で行われる。
- 貸出可否切替：`is_rentable`のみを更新する。更新件数が1件でなければ`UNEXPECTED_DB_STATE`。
- 複数在庫の備品では、`renter_id` / `rented_at`は「直近の貸出」を示すのみで、現在の借主全員を表すものではない（借主ごとの状態は`item_rental_histories`で管理する）。

### 4.4 お知らせ API（`/api/news`）

| メソッド | パス | 概要 | 認証 |
|---|---|---|---|
| GET | `/api/news/{id}` | 記事詳細取得 | 必要 |
| GET | `/api/news` | 記事検索・一覧取得（`keyword`, `categories`, `page`） | 不要 |
| POST | `/api/news` | 記事作成 | 必要 |
| PUT | `/api/news/{id}` | 記事更新 | 必要 |
| PATCH | `/api/news/{id}/published` | 公開／非公開切替（`isPublished`をクエリで指定） | 必要 |
| POST | `/api/news/thumbnail` | サムネイル画像アップロード（`multipart/form-data`、パート名`file`） | 必要 |

- `keyword`は`title`と`content`の部分一致、`categories`はIN検索。
- 記事更新（PUT）は`title`, `content`, `thumbnail_path`, `category`, `updated_at`を更新し、**`is_published`は更新しない**（公開状態は`PATCH .../published`で変更する）。
- 一覧検索は公開フラグによる絞り込みを行わず、`isPublished`をレスポンスに含めて返す。
- **サムネイルアップロード仕様**：許可MIMEタイプは`image/jpeg`・`image/png`・`image/gif`のみ。`ImageIO`で画像として読み込めることも検証し、不正な場合は`INVALID_IMAGE_FILE`。保存先は`{file.upload-dir}/news/{UUID}.{拡張子}`で、`{"thumbnailPath": "/uploads/news/{UUID}.{ext}"}`を返す。このパスを記事の`thumbnailPath`に指定して登録する。サイズ上限は5MB（超過時`FILE_TOO_LARGE`）。保存失敗時は`FILE_UPLOAD_FAILED`。保存した画像は`/uploads/**`で配信される（認証不要のGET）。

### 4.5 技術 API（`/api/technologies`）

全て認証必須。

| メソッド | パス | 概要 |
|---|---|---|
| POST | `/api/technologies` | 技術登録 |
| PUT | `/api/technologies/{id}` | 技術更新 |
| GET | `/api/technologies` | 技術検索・一覧取得（`name`, `page`。技術名または説明の部分一致） |
| GET | `/api/technologies/{id}` | 技術詳細取得 |
| GET | `/api/technologies/{id}/members` | 当該技術の習得者一覧取得（承認済み会員のみ） |
| DELETE | `/api/technologies/{id}` | 技術削除 |

> 備考：会員削除・備品削除・記事削除は実装済みだがControllerではコメントアウトされ、未公開のエンドポイントとなっている（Service層には`deleteMember` / `deleteItem` / `deleteNewsById`メソッドが存在する）。

---

## 5. 認証・認可設計

### 5.1 認証方式

セッションベース認証（Cookie: `JSESSIONID`）を採用する。Spring Securityのデフォルトログインフォームは無効化し、フロントエンド側で作成した独自ログイン画面から`/api/auth/login`を呼び出す方式とする。

- `MemberUserDetailsService`：学籍番号またはメールアドレス（`identifier`）で`Member`を検索し、`MemberUserDetails`（`UserDetails`実装）でラップする。
- パスワード照合：`PasswordEncoder`（BCrypt）による照合。
- 権限（`GrantedAuthority`）：`members.role`を`ROLE_` + role（`ROLE_MEMBER` / `ROLE_ADMIN`）として付与する。権限はログイン時にセッションへ保存されるため、`role`を変更しても、対象会員の既存セッションには再ログインするまで反映されない。
- 承認チェック：`UserDetails`の`isEnabled()`は常に`true`で、未承認の判定は`AuthService.login`内で行う。

### 5.2 認可ルール（`SecurityConfig`）

| パス | メソッド | 認可 |
|---|---|---|
| `/`, `/index.html` | GET | 全員許可 |
| `/api/auth`, `/api/auth/login` | POST | 全員許可 |
| `/api/news`, `/api/members`, `/uploads/**` | GET | 全員許可 |
| `/api/auth/*/approve`, `/api/auth/admin/*` | PATCH | ADMINのみ |
| `/api/auth` | GET | ADMINのみ |
| 上記以外の全リクエスト | - | 認証必須 |

- 全員許可のGETは一覧（`/api/news`, `/api/members`）と画像（`/uploads/**`）のみ。`/api/news/{id}`や`/api/members/{id}`は認証が必要。
- ADMIN限定のルールは会員の承認・権限変更・未承認一覧のみ。備品・お知らせ・技術・会員更新などは、ログイン済みであればロールを問わず実行できる。
- CSRF保護は現時点で無効化（コメントに「後で検討」とあり、暫定対応）。
- CORSは`cors.allowed-origins`（環境変数、カンマ区切りで複数指定可、デフォルト`http://localhost:3000`）で許可オリジンを設定し、`/api/**`に適用。許可メソッドはGET/POST/PUT/PATCH/DELETE。Cookie送信を伴うリクエストを許可（`allowCredentials(true)`）。
- ログアウトは`/api/auth/logout`でセッション破棄＋認証情報クリアを行い、200を返す。

### 5.3 パスワードポリシー

- 新規登録・ログイン・パスワード変更（`oldPassword` / `newPassword`）のいずれも10〜72文字（`@Size(min=10, max=72)`）。
- BCryptでハッシュ化して`password_hash`に保存し、平文は保持しない。

---

## 6. 例外設計

### 6.1 エラーコード一覧（`ErrorCode`）

| コード | HTTPステータス | メッセージ | 備考 |
|---|---|---|---|
| PASSWORD_MISMATCH | 400 | パスワードが正しくありません。 | パスワード変更時の旧パスワード不一致 |
| ITEM_NOT_RENTABLE | 400 | この備品は貸し出しできません。 | |
| ITEM_ALREADY_RENTED | 400 | この備品はすでに貸し出し中です。 | 未使用 |
| NO_ACTIVE_RENTAL | 400 | 有効な貸し出し記録が見つかりません。 | |
| INVALID_IMAGE_FILE | 400 | 画像ファイルは(jpg/png/gif)を指定してください。 | |
| ROLE_MISMATCH | 400 | ロールの名前が正しくありません。 | 権限変更で`ADMIN` / `MEMBER`以外を指定した場合 |
| LOGIN_FAILED | 401 | 学籍番号/メールアドレスまたはパスワードが間違っています。 | |
| UNAUTHENTICATED | 401 | ログインが必要です。 | 未使用 |
| ACCOUNT_NOT_APPROVED | 401 | アカウントが承認されていません。 | |
| ACCESS_DENIED | 403 | この操作を行う権限がありません。 | パスワード変更の本人確認でのみ使用 |
| NEWS_NOT_FOUND | 404 | 指定された記事が見つかりません。 | |
| MEMBER_NOT_FOUND | 404 | 指定されたメンバーが見つかりません。 | |
| ITEM_NOT_FOUND | 404 | 指定された備品が見つかりません。 | 備品詳細・貸出履歴取得で使用 |
| TECHNOLOGY_NOT_FOUND | 404 | 指定された技術が見つかりません。 | |
| DUPLICATE_STUDENT_ID | 409 | この学籍番号は既に登録されています。 | |
| DUPLICATE_EMAIL | 409 | このメールアドレスは既に登録されています。 | |
| FILE_TOO_LARGE | 413 | ファイルサイズが大きすぎます。(上限:5MB) | |
| UNEXPECTED_DB_STATE | 500 | データベースの更新に失敗しました。 | |
| FILE_UPLOAD_FAILED | 500 | ファイルの保存に失敗しました。 | |

### 6.2 例外処理フロー

1. Service層で業務ルール違反を検知すると`BusinessException(ErrorCode)`をスローする。
2. `DbAssertions.requireAffected(expected, actual)`により、INSERT/UPDATE/DELETEの影響行数が期待値と異なる場合は`UNEXPECTED_DB_STATE`をスローし、想定外のDB状態を検知する（楽観的な整合性チェック）。更新対象が存在しない場合も、この経路で500となる。
3. `GlobalExceptionHandler`（`@RestControllerAdvice`）が`BusinessException`を捕捉し、`ErrorCode`に応じたHTTPステータスと`ErrorResponse(message)`をJSONで返却する。
4. `MaxUploadSizeExceededException`（multipart上限超過）も同ハンドラで捕捉し、`FILE_TOO_LARGE`（413）を返す。

---

## 7. バリデーション設計

各リクエストDTOにJakarta Validationのアノテーション（`@NotNull`, `@NotBlank`, `@Size`, `@Email`, `@Pattern`, `@Min`, `@Max`）を付与し、Controllerの`@Valid`で検証する。主な制約は以下の通り。

| 項目 | 制約 |
|---|---|
| 会員氏名 | 必須、50文字以内 |
| 学籍番号 | 必須、正規表現 `^[0-9]{2}[A-Z]{1}[0-9]{4}$`（例: `12A3456`）。会員登録・会員更新の両方 |
| メールアドレス | 必須、メール形式 |
| 学年 | 必須、1〜4の範囲 |
| 役職 | 任意、50文字以内（会員更新） |
| パスワード | 必須、10〜72文字（登録・ログイン・パスワード変更の旧／新） |
| ログイン識別子 | 必須（学籍番号またはメールアドレス） |
| 権限変更の`role` | 必須のクエリパラメータ。`ADMIN` / `MEMBER`のみ許可（Service層で検証、違反は`ROLE_MISMATCH`） |
| 備品名 | 必須、100文字以内 |
| 備品説明 | 必須、255文字以内 |
| 保管場所 | 必須、100文字以内 |
| 備品の在庫数・消耗品フラグ・貸出可否フラグ | 必須 |
| 記事タイトル | 必須、100文字以内 |
| 記事本文 | 必須 |
| 記事カテゴリ | 必須、30文字以内 |
| 記事の公開フラグ | 必須（作成・更新） |
| サムネイル画像 | jpg/png/gifのみ、5MB以下（リクエスト全体は6MB以下） |
| 技術名 | 必須、50文字以内 |
| 技術説明 | 必須、255文字以内 |
| 更新系リクエストの`id` | 会員・備品・記事・技術の更新で必須（4.0参照） |

---

## 8. データアクセス設計（MyBatis）

- MapperインターフェースとXML（`src/main/resources/mapper/*.xml`）を分離して定義する。
- `map-underscore-to-camel-case: true`により、スネークケースのカラム名とEntityのキャメルケースフィールドを自動マッピングする。
- 検索系メソッドは可変条件（名前・カテゴリ・複数フィルタ）を動的SQL（`<if>`, `<where>`, `<foreach>`）で組み立て、`LIMIT`/`OFFSET`によるページング（1ページ20件固定）を各Serviceで共通実装している（`PAGE_SIZE = 20`）。
- 貸出／返却など状態遷移を伴う更新は、条件付きUPDATE文（貸出：`is_rentable = true AND quantity - 1 >= 0`）の影響行数を確認することで、同時実行時の整合性（在庫を超える貸出の防止など）を担保する設計としている。
- `useGeneratedKeys`により、INSERT時に採番IDをEntityへ書き戻す。
- `@Param`を付けていないMapper引数（`MemberMapper.search`の`name`、`updateMemberRole`など）は、`-parameters`コンパイルオプションによるパラメータ名解決に依存している。
- Mapper上に定義されているが現在Serviceから使われていないもの：`MemberMapper.updateByGrade`（学年一括繰り上げ）、`TechnologyMapper.findAll`、`MemberTechnologyMapper.delete`、`ItemRentalHistoryMapper.findByIds` / `findByRenterIds` / `deleteById`。

---

## 9. 画面連携（フロントエンド）

- `src/main/resources/static/index.html`は、各エンドポイントを画面から呼び出せる**APIテスター**（約940行の単一HTML）であり、Spring Bootの静的リソースとして`/`・`/index.html`で配信される。実際の公開画面ではない。
- `css/cssHere.css`・`js/jsHere.js`・`img/imageHere`は未実装のプレースホルダー。
- APIテスターのエンドポイント定義は旧版のままで、次の点が現行APIと合っていない：会員承認・権限変更・未承認一覧・`me`・サムネイルアップロード・ログアウトが未反映、パスワード変更がクエリ指定のまま（現行はJSONボディ）、備品検索のパラメータが旧名`strageLocation`のまま。
- API通信を伴う画面はCookieベースのセッション認証を利用し、CORS設定（`cors.allowed-origins`）で許可されたオリジン（開発時は`http://localhost:3000`）からのアクセスを想定する。

---

## 10. 設定情報

### 10.1 `application.yml`

| 設定キー | 内容 | デフォルト値 |
|---|---|---|
| `spring.application.name` | アプリケーション名 | `homepage` |
| `spring.servlet.multipart.max-file-size` | アップロード1ファイルの上限 | `5MB` |
| `spring.servlet.multipart.max-request-size` | multipartリクエスト全体の上限 | `6MB` |
| `spring.datasource.url` | 接続先DB URL | `jdbc:postgresql://localhost:5432/homepage`（環境変数`DB_URL`で上書き可） |
| `spring.datasource.username` | DBユーザー名 | `postgres`（環境変数`DB_USERNAME`） |
| `spring.datasource.password` | DBパスワード | 環境変数`DB_PASSWORD`必須 |
| `mybatis.mapper-locations` | MapperのXML配置場所 | `classpath:/mapper/*.xml` |
| `mybatis.configuration.map-underscore-to-camel-case` | スネーク⇔キャメル自動変換 | `true` |
| `cors.allowed-origins` | CORS許可オリジン（カンマ区切り） | `http://localhost:3000`（環境変数`CORS_ALLOWED_ORIGINS`） |
| `file.upload-dir` | アップロード画像の保存ルート（実際の保存先は配下の`news/`） | `./uploads`（環境変数`UPLOAD_DIR`） |

### 10.2 主要依存関係（`build.gradle`）

- `spring-boot-starter-security`
- `spring-boot-starter-validation`
- `spring-boot-starter-web`
- `mybatis-spring-boot-starter:3.0.5`
- `postgresql`（ランタイム）
- `lombok`
- `spring-boot-devtools`（開発時のみ）
- テスト：`spring-boot-starter-test`, `mybatis-spring-boot-starter-test`, `spring-security-test`, `junit-platform-launcher`
- コンパイルオプション：`-parameters`（`@Param`なしのパラメータ名解決に利用）

---

## 11. 今後の検討事項（現状のコード上の課題・TODO）

### 11.1 権限・セキュリティ

- **管理者の自己降格**：`PATCH /api/auth/admin/{id}`は対象が自分自身でも変更でき、管理者が自分を`MEMBER`に変更すると管理者がいなくなる可能性がある。自分自身の降格を禁止する判定が必要。
- **ロール別の認可が限定的**：ADMIN限定は会員の承認・権限変更・未承認一覧のみ。備品・お知らせ・技術の作成/更新/削除、会員情報更新（他人の更新を含む）、貸出・返却（`renterId`をパスで任意指定可能）は、ログイン済みであれば誰でも実行できる。ロールと本人確認に基づく認可の設計が必要。
- **CSRF対策**：現状は無効化されており、コメントで「後で検討」とされている。本番運用前に方針決定が必要。

### 11.2 その他

- **削除系APIの一部非公開**：会員削除・備品削除・記事削除はService層に実装済みだが、Controllerではコメントアウトされ未提供。
- **更新系DTOの`id`**：会員・備品・記事・技術の更新DTOは、パス変数と`id`が二重指定になっている（4.0参照）。パスワード変更DTOと同様に、`id`をDTOから外してパス変数のみを使う形への整理が望ましい。
- **未使用コード**：`ItemRentRequest`、`ErrorCode.ITEM_ALREADY_RENTED` / `UNAUTHENTICATED`、8章記載の未使用Mapperメソッド。
- **フロントエンド未実装**：公開画面は未実装で、`static/`配下はAPIテスター（旧エンドポイント定義）とプレースホルダーのみ。
- **テスト**：`HomepageApplicationTests`（コンテキスト起動テスト）のみで、サービス・Mapperのテストは未整備。

### 11.3 対応済み（履歴）

- `GET /api/news`で`is_published = TRUE`のみを返す処理に修正。
- `schema.sql`のDDL構文エラー（`role`行のカンマ欠落）を修正し、`created_at`にデフォルト値を設定。
- 会員検索SQLの`isApproved`条件を`is_approved = TRUE`の固定条件に変更。
- `GET /api/auth`のADMIN制限パターンを`/api/auth`に修正。
- 備品詳細取得の未存在IDを`ITEM_NOT_FOUND`に変更。備品検索・貸出履歴の`page=0`を補正。
- 会員更新時に`updated_at`を更新、貸出・返却時に`items.rented_at`を設定／クリア。
- `application.yml`の`spring.application.name`の全角スペースを修正。
- パスワード変更をJSONボディ化（`MemberPasswordUpdateRequest`）し、`oldPassword` / `newPassword`に長さ検証を追加。
- 技術の習得者一覧（`/api/technologies/{id}/members`）を承認済み会員（`is_approved = TRUE`）のみに絞り込み。
- 管理者による権限変更API（`PATCH /api/auth/admin/{id}`）を追加し、`role`を`ADMIN` / `MEMBER`のみに制限（`ROLE_MISMATCH`を追加）。
