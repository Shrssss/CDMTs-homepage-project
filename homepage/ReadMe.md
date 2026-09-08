# Homepage システム設計書

## 1. 概要

本システムは、団体（サークル・研究会等）のホームページを支えるバックエンドAPIである。以下4つの業務ドメインを扱う。

- **会員管理（Member）**：会員情報の登録・検索・更新
- **認証（Auth）**：会員登録・ログイン・ログアウト・パスワード変更
- **備品管理（Item）**：備品の登録・検索・貸出／返却・貸出履歴管理
- **お知らせ管理（News）**：活動報告記事の投稿・検索・公開管理
- **技術管理（Technology）**：習得技術の登録・会員との紐付け管理

### 1.1 技術スタック

| 分類 | 技術 | バージョン |
|---|---|---|
| 言語 | Java | 21 |
| フレームワーク | Spring Boot | 3.5.15 |
| ビルドツール | Gradle | - |
| O/Rマッパー | MyBatis (mybatis-spring-boot-starter) | 3.0.5 |
| DB | PostgreSQL | - |
| 認証 | Spring Security（セッション方式） | - |
| バリデーション | spring-boot-starter-validation (Jakarta Validation) | - |
| 補助ライブラリ | Lombok | - |

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
| created_at | TIMESTAMP | | 登録日時 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 更新日時 |

#### items（備品）

| カラム | 型 | 制約 | 説明 |
|---|---|---|---|
| id | BIGSERIAL | PK | 備品ID |
| name | VARCHAR(100) | NOT NULL | 備品名 |
| description | VARCHAR(255) | NOT NULL | 説明 |
| storage_location | VARCHAR(100) | NOT NULL | 保管場所 |
| quantity | SMALLINT | NOT NULL | 在庫数 |
| is_disposable | BOOLEAN | NOT NULL, DEFAULT FALSE | 消耗品フラグ |
| is_rentable | BOOLEAN | NOT NULL, DEFAULT FALSE | 貸出可否フラグ |
| renter_id | BIGINT | FK → members(id), ON DELETE SET NULL | 現在の借主ID |
| rented_at | TIMESTAMP | | 貸出日時 |

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
| thumbnail_path | VARCHAR(255) | | サムネイル画像パス |
| category | VARCHAR(30) | NOT NULL | カテゴリ |
| is_published | BOOLEAN | NOT NULL, DEFAULT FALSE | 公開フラグ |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 投稿日時 |
| updated_at | TIMESTAMP | | 更新日時 |

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
│   └── SecurityConfig.java          Spring Security設定（CORS, 認可, ログアウト）
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
│   └── TechnologyService.java
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
│       ├── member/  (CreateRequest, UpdateRequest, LoginRequest, Response, DetailResponse)
│       ├── item/    (CreateRequest, UpdateRequest, RentRequest, Response, DetailResponse, RentalHistoryResponse)
│       ├── news/    (CreateRequest, UpdateRequest, Response, DetailResponse)
│       └── technology/ (CreateRequest, UpdateRequest, Response, DetailResponse)
├── security/
│   ├── MemberUserDetails.java        UserDetails実装（Memberをラップ）
│   └── MemberUserDetailsService.java UserDetailsService実装（学籍番号/メールでロード）
└── exception/
    ├── ErrorCode.java                エラーコード定義（HTTPステータス＋メッセージ）
    ├── BusinessException.java        業務例外
    ├── ErrorResponse.java            エラーレスポンスDTO（record）
    ├── GlobalExceptionHandler.java   @RestControllerAdviceによる例外ハンドリング
    └── DbAssertions.java             DB更新件数の検証ユーティリティ
```

---

## 4. API設計

### 4.1 認証 API（`/api/auth`）

| メソッド | パス | 概要 | 認証要否 | リクエスト | レスポンス |
|---|---|---|---|---|---|
| POST | `/api/auth` | 会員登録 | 不要 | `MemberCreateRequest` | `Long`（会員ID） |
| POST | `/api/auth/login` | ログイン | 不要 | `MemberLoginRequest` | `Long`（会員ID） |
| POST | `/api/auth/{id}/passUpdate` | パスワード変更 | 必要 | `oldPassword`, `newPassword`（クエリ） | `Long`（会員ID） |
| POST | `/api/auth/logout` | ログアウト | 必要 | - | 200 OK |

**会員登録・ログイン仕様**

- パスワードはBCryptでハッシュ化して保存する。
- 学籍番号・メールアドレスの重複はDB検索によって事前チェックし、重複時は`DUPLICATE_STUDENT_ID` / `DUPLICATE_EMAIL`を返す。
- ログインは学籍番号またはメールアドレス（`identifier`）＋パスワードで行う。Spring Securityの`AuthenticationManager`に処理を委譲し、認証成功時は`SecurityContext`をHTTPセッションに保存する（`HttpSessionSecurityContextRepository`）。
- パスワード変更は、ログイン中の本人（`SecurityContextHolder`から取得した`MemberUserDetails`）とパス変数の`id`が一致しない場合`ACCESS_DENIED`を返す。旧パスワードの一致確認後に更新する。

### 4.2 会員 API（`/api/members`）

| メソッド | パス | 概要 | クエリ／パラメータ |
|---|---|---|---|
| GET | `/api/members` | 会員検索・一覧取得 | `name`, `grades`, `positions`, `page`（デフォルト1） |
| GET | `/api/members/{id}` | 会員詳細取得（習得技術一覧含む） | - |
| PUT | `/api/members/{id}` | 会員情報更新（技術紐付けも一括更新） | `MemberUpdateRequest` |

会員更新時は、`member_technologies`をいったん全削除した上で、リクエストの`technologyIds`を再登録する（洗い替え方式）。

### 4.3 備品 API（`/api/items`）

| メソッド | パス | 概要 |
|---|---|---|
| POST | `/api/items` | 備品登録 |
| PUT | `/api/items/{id}` | 備品更新 |
| GET | `/api/items/{id}` | 備品詳細取得 |
| GET | `/api/items` | 備品検索・一覧取得（`name`, `strageLocation`, `isDisposable`, `isRentable`, `page`） |
| GET | `/api/items/{id}/history` | 貸出履歴取得（`page`） |
| PUT | `/api/items/rent/{id}/{renterId}` | 貸出処理 |
| PUT | `/api/items/return/{id}/{renterId}` | 返却処理 |
| PUT | `/api/items/Availability/{id}/{isRentable}` | 貸出可否切替 |

**貸出／返却の業務ロジック**

- 貸出：`items.renter_id`／`rented_at`を条件付きUPDATE（`updateByRenting`）し、更新件数が1件でなければ`ITEM_NOT_RENTABLE`（すでに借りられている等）とする。成功時は`item_rental_histories`へ新規レコードを1件INSERTする。
- 返却：`items`の借主情報をクリアする条件付きUPDATE（`updateByReturning`）を行い、対象の借主IDと一致する行が更新されなければ`NO_ACTIVE_RENTAL`とする。あわせて対応する有効な履歴レコード（`returned_at IS NULL`）を検索し、`returned_at`を更新する。

### 4.4 お知らせ API（`/api/news`）

| メソッド | パス | 概要 |
|---|---|---|
| GET | `/api/news/{id}` | 記事詳細取得 |
| GET | `/api/news` | 記事検索・一覧取得（`keyword`, `categories`, `page`） |
| POST | `/api/news` | 記事作成 |
| PUT | `/api/news/{id}` | 記事更新 |
| PATCH | `/api/news/{id}/published` | 公開／非公開切替（`isPublished`） |

### 4.5 技術 API（`/api/technologies`）

| メソッド | パス | 概要 |
|---|---|---|
| POST | `/api/technologies` | 技術登録 |
| PUT | `/api/technologies/{id}` | 技術更新 |
| GET | `/api/technologies` | 技術検索・一覧取得（`name`, `page`） |
| GET | `/api/technologies/{id}` | 技術詳細取得 |
| GET | `/api/technologies/{id}/members` | 当該技術の習得者一覧取得 |
| DELETE | `/api/technologies/{id}` | 技術削除 |

> 備考：会員削除・備品削除は実装済みだがControllerではコメントアウトされ、未公開のエンドポイントとなっている（Service層には`deleteMember` / `deleteItem`メソッドが存在する）。

---

## 5. 認証・認可設計

### 5.1 認証方式

セッションベース認証（Cookie: `JSESSIONID`）を採用する。Spring Securityのデフォルトログインフォームは無効化し、フロントエンド側で作成した独自ログイン画面から`/api/auth/login`を呼び出す方式とする。

- `MemberUserDetailsService`：学籍番号またはメールアドレス（`identifier`）で`Member`を検索し、`MemberUserDetails`（`UserDetails`実装）でラップする。
- パスワード照合：`PasswordEncoder`（BCrypt）による照合。
- 権限（`GrantedAuthority`）は現状未実装（空リストを返却）であり、将来的なロール追加の余地を残している。

### 5.2 認可ルール（`SecurityConfig`）

| パス | メソッド | 認可 |
|---|---|---|
| `/`, `/index.html` | GET | 全員許可 |
| `/api/auth`, `/api/auth/login` | POST | 全員許可 |
| 上記以外の全リクエスト | - | 認証必須 |

- CSRF保護は現時点で無効化（コメントに「後で検討」とあり、暫定対応）。
- CORSは`cors.allowed-origins`（環境変数、デフォルト`http://localhost:3000`）で許可オリジンを設定し、`/api/**`に適用。Cookie送信を伴うリクエストを許可（`allowCredentials(true)`）。
- ログアウトは`/api/auth/logout`でセッション破棄＋認証情報クリアを行う。

### 5.3 パスワードポリシー

- 新規登録・変更時ともに10〜72文字。
- BCryptでハッシュ化して`password_hash`に保存し、平文は保持しない。

---

## 6. 例外設計

### 6.1 エラーコード一覧（`ErrorCode`）

| コード | HTTPステータス | メッセージ |
|---|---|---|
| PASSWORD_MISMATCH | 400 | パスワードが正しくありません。 |
| ITEM_NOT_RENTABLE | 400 | この備品は貸し出しできません。 |
| ITEM_ALREADY_RENTED | 400 | この備品はすでに貸し出し中です。 |
| NO_ACTIVE_RENTAL | 400 | 有効な貸し出し記録が見つかりません。 |
| LOGIN_FAILED | 401 | 学籍番号/メールアドレスまたはパスワードが間違っています。 |
| UNAUTHENTICATED | 401 | ログインが必要です。 |
| ACCESS_DENIED | 403 | この操作を行う権限がありません。 |
| NEWS_NOT_FOUND | 404 | 指定された記事が見つかりません。 |
| MEMBER_NOT_FOUND | 404 | 指定されたメンバーが見つかりません。 |
| ITEM_NOT_FOUND | 404 | 指定された備品が見つかりません。 |
| TECHNOLOGY_NOT_FOUND | 404 | 指定された技術が見つかりません。 |
| DUPLICATE_STUDENT_ID | 409 | この学籍番号は既に登録されています。 |
| DUPLICATE_EMAIL | 409 | このメールアドレスは既に登録されています。 |
| UNEXPECTED_DB_STATE | 500 | データベースの更新に失敗しました。 |

### 6.2 例外処理フロー

1. Service層で業務ルール違反を検知すると`BusinessException(ErrorCode)`をスローする。
2. `DbAssertions.requireAffected(expected, actual)`により、INSERT/UPDATE/DELETEの影響行数が期待値と異なる場合は`UNEXPECTED_DB_STATE`をスローし、想定外のDB状態を検知する（楽観的な整合性チェック）。
3. `GlobalExceptionHandler`（`@RestControllerAdvice`）が`BusinessException`を捕捉し、`ErrorCode`に応じたHTTPステータスと`ErrorResponse(message)`をJSONで返却する。

---

## 7. バリデーション設計

各リクエストDTOにJakarta Validationのアノテーション（`@NotNull`, `@NotBlank`, `@Size`, `@Email`, `@Pattern`, `@Min`, `@Max`）を付与し、Controllerの`@Valid`で検証する。主な制約は以下の通り。

| 項目 | 制約 |
|---|---|
| 会員氏名 | 必須、50文字以内 |
| 学籍番号 | 必須、正規表現 `^[0-9]{2}[A-Z]{1}[0-9]{4}$`（例: `12A3456`） |
| メールアドレス | 必須、メール形式 |
| 学年 | 必須、1〜4の範囲 |
| パスワード | 必須、10〜72文字 |
| 備品名 | 必須、100文字以内 |
| 備品説明 | 必須、255文字以内 |
| 保管場所 | 必須、100文字以内 |
| 記事タイトル | 必須、100文字以内 |
| 記事カテゴリ | 必須、30文字以内 |
| 技術名 | 必須、50文字以内 |
| 技術説明 | 必須、255文字以内 |

---

## 8. データアクセス設計（MyBatis）

- MapperインターフェースとXML（`src/main/resources/mapper/*.xml`）を分離して定義する。
- `map-underscore-to-camel-case: true`により、スネークケースのカラム名とEntityのキャメルケースフィールドを自動マッピングする。
- 検索系メソッドは可変条件（名前・カテゴリ・複数フィルタ）を動的SQL（`<if>`等）で組み立てる想定であり、`offset`/`limit`によるページング（1ページ20件固定）を各Serviceで共通実装している（`PAGE_SIZE = 20`）。
- 貸出／返却など状態遷移を伴う更新は、条件付きUPDATE文の影響行数を確認することで、同時実行時の整合性（二重貸出の防止など）を担保する設計としている。

---

## 9. 画面連携（フロントエンド）

- `src/main/resources/static/` 配下に`index.html`, `css/`, `js/` が配置されており、Spring Bootの静的リソースとして配信される（プレースホルダー段階：`cssHere.css`, `jsHere.js`, `imageHere`）。
- API通信を伴う画面はCookieベースのセッション認証を利用し、CORS設定（`cors.allowed-origins`）で許可されたオリジン（開発時は`http://localhost:3000`）からのアクセスを想定する。

---

## 10. 設定情報

### 10.1 `application.yml`

| 設定キー | 内容 | デフォルト値 |
|---|---|---|
| `spring.application.name` | アプリケーション名 | homepage |
| `spring.datasource.url` | 接続先DB URL | `jdbc:postgresql://localhost:5432/homepage`（環境変数`DB_URL`で上書き可） |
| `spring.datasource.username` | DBユーザー名 | `postgres`（環境変数`DB_USERNAME`） |
| `spring.datasource.password` | DBパスワード | 環境変数`DB_PASSWORD`必須 |
| `mybatis.mapper-locations` | MapperのXML配置場所 | `classpath:/mapper/*.xml` |
| `mybatis.configuration.map-underscore-to-camel-case` | スネーク⇔キャメル自動変換 | `true` |
| `cors.allowed-origins` | CORS許可オリジン | `http://localhost:3000`（環境変数`CORS_ALLOWED_ORIGINS`） |

### 10.2 主要依存関係（`build.gradle`）

- `spring-boot-starter-security`
- `spring-boot-starter-validation`
- `spring-boot-starter-web`
- `mybatis-spring-boot-starter:3.0.5`
- `postgresql`（ランタイム）
- `lombok`
- テスト：`spring-boot-starter-test`, `mybatis-spring-boot-starter-test`, `spring-security-test`

---

## 11. 今後の検討事項（現状のコード上の課題・TODO）

- **権限（ロール）機能未実装**：`MemberUserDetails.getAuthorities()`は空リストを返しており、管理者／一般会員などの権限分離が今後の課題。
- **CSRF対策**：現状は無効化されており、コメントで「後で検討」とされている。本番運用前に方針決定が必要。
- **削除系APIの一部非公開**：会員削除・備品削除はService層に実装済みだが、Controllerではコメントアウトされ未提供。
- **フロントエンド未実装**：`static/`配下は雛形のみ（プレースホルダーファイル）で、実際の画面実装はこれから。
