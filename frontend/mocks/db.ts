import type {
  ItemRentalHistories,
  Items,
  Members,
  MemberTechnologies,
  News,
  Technologies,
} from "@/lib/types/api";

/* MSW用のインメモリDB（lib/types/api.ts のテーブル型に合わせる）
   書き込み系のリクエストはここを書き換える。リロードすると初期状態に戻る */

// バックエンドの LocalDateTime 形式（タイムゾーンなし）で日時を作る
const localDateTime = (daysAgo: number) => {
  const d = new Date(Date.UTC(2026, 9, 20, 12, 0, 0) - daysAgo * 86400000);
  return d.toISOString().slice(0, 19);
};

// パスワードはテーブル型に含まれないため別で持つ（全員共通）
export const MOCK_PASSWORD = "password";

const POSITIONS = ["部長", "副部長", "会計", null, null, null];
const FAMILY_NAMES = ["佐藤", "鈴木", "高橋", "田中", "伊藤", "渡辺", "山本", "中村", "小林", "加藤"];
const GIVEN_NAMES = ["太郎", "花子", "健", "美咲", "翔太", "陽菜", "大輝", "結衣"];

// 承認状態とロールはテーブル型に含まれないためモック側で持つ
export type MockMember = Members & { isApproved: boolean; role: "MEMBER" | "ADMIN" };

// 1人目（24000001 / member1@example.com）は管理者。最後の3人は承認待ち
const members: MockMember[] = Array.from({ length: 26 }, (_, i) => ({
  id: i + 1,
  name: `${FAMILY_NAMES[i % FAMILY_NAMES.length]} ${GIVEN_NAMES[i % GIVEN_NAMES.length]}`,
  studentId: 24000001 + i,
  email: `member${i + 1}@example.com`,
  grade: (i % 4) + 1,
  position: i < POSITIONS.length ? POSITIONS[i] : null,
  createdAt: localDateTime(300 - i),
  updatedAt: localDateTime(30 - (i % 30)),
  isApproved: i < 23,
  role: i === 0 ? "ADMIN" : "MEMBER",
}));

const technologies: Technologies[] = [
  { id: 1, name: "TypeScript", description: "型付きのJavaScript。フロントエンド開発で使用。" },
  { id: 2, name: "React", description: "UIを構築するためのライブラリ。" },
  { id: 3, name: "Next.js", description: "Reactのフレームワーク。このサイトでも使用。" },
  { id: 4, name: "Java", description: "バックエンド開発で使用する言語。" },
  { id: 5, name: "Spring Boot", description: "JavaのWebアプリケーションフレームワーク。" },
  { id: 6, name: "Python", description: "データ分析や機械学習で使用。" },
  { id: 7, name: "Docker", description: "コンテナ仮想化ツール。" },
  { id: 8, name: "Git", description: "バージョン管理システム。" },
];

const memberTechnologies: MemberTechnologies[] = members.flatMap((m) =>
  technologies
    .filter((t) => (m.id + t.id) % 3 === 0)
    .map((t) => ({ memberId: m.id, technologyId: t.id })),
);

const NEWS_CATEGORIES = ["お知らせ", "活動報告", "イベント", "LT会","レクリエーション"];

const news: News[] = Array.from({ length: 25 }, (_, i) => {
  const category = NEWS_CATEGORIES[i % NEWS_CATEGORIES.length];
  return {
    id: i + 1,
    title: `${category}：モック記事 ${i + 1}`,
    content: `これはMSWで返しているモックの記事本文です（id: ${i + 1}）。\n\n実際のバックエンドに接続すると、この内容は置き換わります。`,
    thumbnailPath: i % 3 === 0 ? undefined : "/images/placeholder.jpg",
    category,
    isPublished: i % 7 !== 6,
    createdAt: localDateTime(i * 3),
    updatedAt: localDateTime(i * 3),
  };
});

const STORAGE_LOCATIONS = ["部室A棚", "部室B棚", "ロッカー", "倉庫"];
const ITEM_NAMES = ["HDMIケーブル", "ノートPC", "プロジェクター", "延長コード", "マウス", "キーボード", "USBハブ", "ホワイトボードマーカー"];

const items: Items[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `${ITEM_NAMES[i % ITEM_NAMES.length]} #${Math.floor(i / ITEM_NAMES.length) + 1}`,
  description: `${ITEM_NAMES[i % ITEM_NAMES.length]}のモックデータです。`,
  storageLocation: STORAGE_LOCATIONS[i % STORAGE_LOCATIONS.length],
  quantity: (i % 5) + 1,
  isDisposable: ITEM_NAMES[i % ITEM_NAMES.length] === "ホワイトボードマーカー",
  isRentable: i % 4 !== 3,
  renterId: i % 6 === 0 ? (i % members.length) + 1 : null,
  rentedAt: i % 6 === 0 ? localDateTime(2) : null,
}));

const itemRentalHistories: ItemRentalHistories[] = items.flatMap<ItemRentalHistories>((item) =>
  Array.from({ length: item.id % 4 }, (_, j) => ({
    id: item.id * 10 + j,
    itemId: item.id,
    renterId: ((item.id + j) % members.length) + 1,
    rentedAt: localDateTime(60 - j * 10),
    returnedAt: localDateTime(55 - j * 10),
  })),
).concat(
  // 貸出中の備品には返却前の記録を付ける
  items
    .filter((item) => item.renterId !== null)
    .map((item) => ({
      id: item.id * 10 + 9,
      itemId: item.id,
      renterId: item.renterId!,
      rentedAt: item.rentedAt,
      returnedAt: null,
    })),
);

// ログイン中のメンバーID（Cookieの代わり）
// MSWのDBはリロードで初期化されるが、ログイン状態はタブを閉じるまで残す
const SESSION_KEY = "msw-session-member-id";
const session = {
  get memberId(): number | null {
    try {
      const v = sessionStorage.getItem(SESSION_KEY);
      return v === null ? null : Number(v);
    } catch {
      return null;
    }
  },
  set memberId(id: number | null) {
    try {
      if (id === null) sessionStorage.removeItem(SESSION_KEY);
      else sessionStorage.setItem(SESSION_KEY, String(id));
    } catch {
      // sessionStorage が使えない環境ではログイン状態を保持しない
    }
  },
};

export const db = {
  members,
  technologies,
  memberTechnologies,
  news,
  items,
  itemRentalHistories,
  session,
};

export const nextId = (rows: { id: number }[]) =>
  rows.reduce((max, r) => Math.max(max, r.id), 0) + 1;

export const now = () => new Date().toISOString().slice(0, 19);
