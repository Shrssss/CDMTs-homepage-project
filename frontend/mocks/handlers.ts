import { delay, http, HttpResponse } from "msw";
import type { z } from "zod";
import { baseURL } from "@/lib/features/api";
import type { ItemCreateRequest, ItemUpdateRequest } from "@/lib/features/items";
import type {
  MemberCreateRequest,
  MemberLoginRequest,
  MemberUpdateRequest,
} from "@/lib/features/member";
import type { NewsCreateRequest, NewsUpdateRequest } from "@/lib/features/news";
import type {
  TechnologyCreateRequest,
  TechnologyUpdateRequest,
} from "@/lib/features/technologies";
import type {
  ItemDetailResponseSchema,
  ItemRentalHistoriesResponseSchema,
  ItemsResponseSchema,
  MemberDetailResponseSchema,
  Members,
  MembersResponseSchema,
  NewsDetailResponseSchema,
  NewsResponseSchema,
  TechnologyDetailResponseSchema,
  TechnologyResponseSchema,
  ThumbnailUploadResponseSchema,
} from "@/lib/types/api";
import { db, MOCK_PASSWORD, nextId, now } from "./db";

/* MSWのリクエストハンドラー
   レスポンスの型は lib/types/api.ts のレスポンススキーマ（parse前の形）に合わせる */

// バックエンドの PAGE_SIZE と合わせる
const PAGE_SIZE = 20;

// 通信待ちの表示を確認できるように少し遅延させる
const LATENCY_MS = 300;

const api = (path: string) => `${baseURL}${path}`;

// page は1始まり
const paginate = <T>(rows: T[], page: string | null) => {
  const p = Math.max(Number(page ?? 1) || 1, 1);
  return rows.slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE);
};

const parseBool = (value: string | null) =>
  value === null ? undefined : value === "true";

const notFound = () => new HttpResponse(null, { status: 404 });

const toNewsSummary = (n: (typeof db.news)[number]) => ({
  id: n.id,
  title: n.title,
  thumbnailPath: n.thumbnailPath ?? null,
  category: n.category,
  isPublished: n.isPublished,
  createdAt: n.createdAt ?? now(),
});

const byNewest = (a: { createdAt: string | null }, b: { createdAt: string | null }) =>
  (b.createdAt ?? "").localeCompare(a.createdAt ?? "");

const toMemberSummary = (m: Members) => ({
  id: m.id,
  name: m.name,
  grade: m.grade,
  position: m.position,
});

export const handlers = [
  /* ---------- members ---------- */

  http.get(api("/members"), async ({ request }) => {
    await delay(LATENCY_MS);
    const params = new URL(request.url).searchParams;
    const name = params.get("name");
    const grades = params.getAll("grades").map(Number);
    const positions = params.getAll("positions");

    const rows = db.members
      .filter((m) => !name || m.name.includes(name))
      .filter((m) => grades.length === 0 || grades.includes(m.grade))
      .filter(
        (m) => positions.length === 0 || (m.position !== null && positions.includes(m.position)),
      )
      .map(toMemberSummary);

    return HttpResponse.json<z.input<typeof MembersResponseSchema>>(
      paginate(rows, params.get("page")),
    );
  }),

  http.get(api("/members/:id"), async ({ params }) => {
    await delay(LATENCY_MS);
    const member = db.members.find((m) => m.id === Number(params.id));
    if (!member) return notFound();

    const technologyIds = db.memberTechnologies
      .filter((mt) => mt.memberId === member.id)
      .map((mt) => mt.technologyId);

    return HttpResponse.json<z.input<typeof MemberDetailResponseSchema>>({
      ...toMemberSummary(member),
      technologies: db.technologies
        .filter((t) => technologyIds.includes(t.id))
        .map((t) => ({ id: t.id, name: t.name })),
    });
  }),

  http.put<{ id: string }, MemberUpdateRequest>(api("/members/:id"), async ({ params, request }) => {
    await delay(LATENCY_MS);
    const member = db.members.find((m) => m.id === Number(params.id));
    if (!member) return notFound();

    const body = await request.json();
    Object.assign(member, {
      name: body.name,
      email: body.email,
      studentId: Number(body.studentId),
      grade: body.grade,
      position: body.position ?? null,
      updatedAt: now(),
    });
    if (body.technologyIds) {
      db.memberTechnologies = db.memberTechnologies
        .filter((mt) => mt.memberId !== member.id)
        .concat(body.technologyIds.map((technologyId) => ({ memberId: member.id, technologyId })));
    }
    return new HttpResponse(null, { status: 200 });
  }),

  /* ---------- auth ---------- */

  http.post<never, MemberCreateRequest>(api("/auth"), async ({ request }) => {
    await delay(LATENCY_MS);
    const body = await request.json();
    const id = nextId(db.members);
    db.members.push({
      id,
      name: body.name,
      studentId: Number(body.studentId),
      email: body.email,
      grade: body.grade,
      position: null,
      createdAt: now(),
      updatedAt: now(),
    });
    return HttpResponse.json(id);
  }),

  // identifier は学籍番号またはメールアドレス。パスワードは全員 MOCK_PASSWORD
  http.post<never, MemberLoginRequest>(api("/auth/login"), async ({ request }) => {
    await delay(LATENCY_MS);
    const { identifier, password } = await request.json();
    const member = db.members.find(
      (m) => String(m.studentId) === identifier || m.email === identifier,
    );
    if (!member || password !== MOCK_PASSWORD) {
      return new HttpResponse(null, { status: 401 });
    }
    db.session.memberId = member.id;
    return HttpResponse.json(member.id);
  }),

  http.post(api("/auth/logout"), async () => {
    await delay(LATENCY_MS);
    db.session.memberId = null;
    return new HttpResponse(null, { status: 200 });
  }),

  http.post(api("/auth/:id/passUpdate"), async ({ params, request }) => {
    await delay(LATENCY_MS);
    const oldPassword = new URL(request.url).searchParams.get("oldPassword");
    if (oldPassword !== MOCK_PASSWORD) {
      return new HttpResponse(null, { status: 400 });
    }
    return HttpResponse.json(Number(params.id));
  }),

  /* ---------- news ---------- */

  // ホームページ用。公開中の記事のみ返す
  http.get(api("/news"), async ({ request }) => {
    await delay(LATENCY_MS);
    const params = new URL(request.url).searchParams;
    const keyword = params.get("keyword");
    const categories = params.getAll("categories");

    const rows = db.news
      .filter((n) => n.isPublished)
      .filter((n) => !keyword || n.title.includes(keyword) || n.content.includes(keyword))
      .filter((n) => categories.length === 0 || categories.includes(n.category))
      .sort(byNewest)
      .map(toNewsSummary);

    return HttpResponse.json<z.input<typeof NewsResponseSchema>>(
      paginate(rows, params.get("page")),
    );
  }),

  // 管理画面用。下書きも含めてすべての記事を返す
  // /news/:id より先に置かないと allNews が id として扱われる
  http.get(api("/news/allNews"), async ({ request }) => {
    await delay(LATENCY_MS);
    const params = new URL(request.url).searchParams;
    const rows = [...db.news].sort(byNewest).map(toNewsSummary);

    return HttpResponse.json<z.input<typeof NewsResponseSchema>>(
      paginate(rows, params.get("page")),
    );
  }),

  http.get(api("/news/:id"), async ({ params }) => {
    await delay(LATENCY_MS);
    const n = db.news.find((n) => n.id === Number(params.id));
    if (!n) return notFound();

    const createdAt = n.createdAt ?? now();
    return HttpResponse.json<z.input<typeof NewsDetailResponseSchema>>({
      title: n.title,
      content: n.content,
      thumbnailPath: n.thumbnailPath ?? null,
      category: n.category,
      isPublished: n.isPublished,
      createdAt,
      updatedAt: n.updatedAt ?? createdAt,
    });
  }),

  http.post(api("/news/thumbnail"), async () => {
    await delay(LATENCY_MS);
    return HttpResponse.json<z.input<typeof ThumbnailUploadResponseSchema>>({
      thumbnailPath: "/images/placeholder.jpg",
    });
  }),

  http.post<never, NewsCreateRequest>(api("/news"), async ({ request }) => {
    await delay(LATENCY_MS);
    const body = await request.json();
    const id = nextId(db.news);
    db.news.push({
      id,
      title: body.title,
      content: body.content,
      thumbnailPath: body.thumbnailPath ?? undefined,
      category: body.category,
      isPublished: body.isPublished,
      createdAt: now(),
      updatedAt: now(),
    });
    return HttpResponse.json(id);
  }),

  http.put<{ id: string }, NewsUpdateRequest>(api("/news/:id"), async ({ params, request }) => {
    await delay(LATENCY_MS);
    const n = db.news.find((n) => n.id === Number(params.id));
    if (!n) return notFound();

    const body = await request.json();
    Object.assign(n, {
      title: body.title,
      content: body.content,
      thumbnailPath: body.thumbnailPath ?? undefined,
      category: body.category,
      isPublished: body.isPublished,
      updatedAt: now(),
    });
    return new HttpResponse(null, { status: 200 });
  }),

  http.patch(api("/news/:id/published"), async ({ params, request }) => {
    await delay(LATENCY_MS);
    const n = db.news.find((n) => n.id === Number(params.id));
    if (!n) return notFound();

    n.isPublished = new URL(request.url).searchParams.get("isPublished") === "true";
    n.updatedAt = now();
    return new HttpResponse(null, { status: 200 });
  }),

  http.delete(api("/news/:id"), async ({ params }) => {
    await delay(LATENCY_MS);
    const id = Number(params.id);
    db.news = db.news.filter((n) => n.id !== id);
    return new HttpResponse(null, { status: 200 });
  }),

  /* ---------- technologies ---------- */

  http.get(api("/technologies"), async ({ request }) => {
    await delay(LATENCY_MS);
    const params = new URL(request.url).searchParams;
    const name = params.get("name");

    const rows = db.technologies
      .filter((t) => !name || t.name.toLowerCase().includes(name.toLowerCase()))
      .map((t) => ({ id: t.id, name: t.name }));

    return HttpResponse.json<z.input<typeof TechnologyResponseSchema>>(
      paginate(rows, params.get("page")),
    );
  }),

  http.get(api("/technologies/:id"), async ({ params }) => {
    await delay(LATENCY_MS);
    const t = db.technologies.find((t) => t.id === Number(params.id));
    if (!t) return notFound();
    return HttpResponse.json<z.input<typeof TechnologyDetailResponseSchema>>(t);
  }),

  http.get(api("/technologies/:id/members"), async ({ params }) => {
    await delay(LATENCY_MS);
    const memberIds = db.memberTechnologies
      .filter((mt) => mt.technologyId === Number(params.id))
      .map((mt) => mt.memberId);

    return HttpResponse.json<z.input<typeof MembersResponseSchema>>(
      db.members.filter((m) => memberIds.includes(m.id)).map(toMemberSummary),
    );
  }),

  http.post<never, TechnologyCreateRequest>(api("/technologies"), async ({ request }) => {
    await delay(LATENCY_MS);
    const body = await request.json();
    const id = nextId(db.technologies);
    db.technologies.push({ id, name: body.name, description: body.description });
    return HttpResponse.json(id);
  }),

  http.put<{ id: string }, TechnologyUpdateRequest>(
    api("/technologies/:id"),
    async ({ params, request }) => {
      await delay(LATENCY_MS);
      const t = db.technologies.find((t) => t.id === Number(params.id));
      if (!t) return notFound();

      const body = await request.json();
      Object.assign(t, { name: body.name, description: body.description });
      return new HttpResponse(null, { status: 200 });
    },
  ),

  http.delete(api("/technologies/:id"), async ({ params }) => {
    await delay(LATENCY_MS);
    const id = Number(params.id);
    db.technologies = db.technologies.filter((t) => t.id !== id);
    db.memberTechnologies = db.memberTechnologies.filter((mt) => mt.technologyId !== id);
    return new HttpResponse(null, { status: 200 });
  }),

  /* ---------- items ---------- */

  http.get(api("/items"), async ({ request }) => {
    await delay(LATENCY_MS);
    const params = new URL(request.url).searchParams;
    const name = params.get("name");
    const storageLocations = params.getAll("storageLocation");
    const isDisposable = parseBool(params.get("isDisposable"));
    const isRentable = parseBool(params.get("isRentable"));

    const rows = db.items
      .filter((i) => !name || i.name.includes(name))
      .filter(
        (i) =>
          storageLocations.length === 0 ||
          storageLocations.some((s) => i.storageLocation.includes(s)),
      )
      .filter((i) => isDisposable === undefined || i.isDisposable === isDisposable)
      .filter((i) => isRentable === undefined || i.isRentable === isRentable)
      .map((i) => ({
        id: i.id,
        name: i.name,
        storageLocation: i.storageLocation,
        isDisposable: i.isDisposable,
        isRentable: i.isRentable,
      }));

    return HttpResponse.json<z.input<typeof ItemsResponseSchema>>(
      paginate(rows, params.get("page")),
    );
  }),

  http.get(api("/items/:id"), async ({ params }) => {
    await delay(LATENCY_MS);
    const item = db.items.find((i) => i.id === Number(params.id));
    if (!item) return notFound();

    return HttpResponse.json<z.input<typeof ItemDetailResponseSchema>>({
      id: item.id,
      name: item.name,
      description: item.description,
      storageLocation: item.storageLocation,
      quantity: item.quantity,
      isDisposable: item.isDisposable,
      isRentable: item.isRentable,
    });
  }),

  http.get(api("/items/:id/history"), async ({ params, request }) => {
    await delay(LATENCY_MS);
    const item = db.items.find((i) => i.id === Number(params.id));
    if (!item) return notFound();

    const memberName = (id: number) => db.members.find((m) => m.id === id)?.name ?? "不明";
    const rows = db.itemRentalHistories
      .filter((h) => h.itemId === item.id)
      .map((h) => ({
        id: h.id,
        itemName: item.name,
        renterName: memberName(h.renterId),
        rentedAt: h.rentedAt ?? now(),
        returnedAt: h.returnedAt,
      }));

    return HttpResponse.json<z.input<typeof ItemRentalHistoriesResponseSchema>>(
      paginate(rows, new URL(request.url).searchParams.get("page")),
    );
  }),

  http.post<never, ItemCreateRequest>(api("/items"), async ({ request }) => {
    await delay(LATENCY_MS);
    const body = await request.json();
    const id = nextId(db.items);
    db.items.push({ id, ...body, renterId: null, rentedAt: null });
    return HttpResponse.json(id);
  }),

  // 借りる人はログイン中のメンバー
  http.put(api("/items/rent/:id"), async ({ params }) => {
    await delay(LATENCY_MS);
    const renterId = db.session.memberId;
    if (renterId === null) return new HttpResponse(null, { status: 401 });
    const item = db.items.find((i) => i.id === Number(params.id));
    if (!item) return notFound();
    if (!item.isRentable || item.renterId !== null) {
      return new HttpResponse(null, { status: 409 });
    }

    const rentedAt = now();
    Object.assign(item, { renterId, rentedAt });
    db.itemRentalHistories.push({
      id: nextId(db.itemRentalHistories),
      itemId: item.id,
      renterId,
      rentedAt,
      returnedAt: null,
    });
    return HttpResponse.json(item.id);
  }),

  // 返す人はログイン中のメンバー
  http.put(api("/items/return/:id"), async ({ params }) => {
    await delay(LATENCY_MS);
    const renterId = db.session.memberId;
    if (renterId === null) return new HttpResponse(null, { status: 401 });
    const item = db.items.find((i) => i.id === Number(params.id));
    if (!item) return notFound();

    const history = db.itemRentalHistories.find(
      (h) => h.itemId === item.id && h.renterId === renterId && h.returnedAt === null,
    );
    if (history) history.returnedAt = now();
    Object.assign(item, { renterId: null, rentedAt: null });
    return HttpResponse.json(item.id);
  }),

  http.put(api("/items/Availability/:id/:isRentable"), async ({ params }) => {
    await delay(LATENCY_MS);
    const item = db.items.find((i) => i.id === Number(params.id));
    if (!item) return notFound();

    item.isRentable = params.isRentable === "true";
    return HttpResponse.json(item.id);
  }),

  http.put<{ id: string }, ItemUpdateRequest>(api("/items/:id"), async ({ params, request }) => {
    await delay(LATENCY_MS);
    const item = db.items.find((i) => i.id === Number(params.id));
    if (!item) return notFound();

    const body = await request.json();
    Object.assign(item, {
      name: body.name,
      description: body.description,
      storageLocation: body.storageLocation,
      quantity: body.quantity,
      isDisposable: body.isDisposable,
      isRentable: body.isRentable,
    });
    return new HttpResponse(null, { status: 200 });
  }),
];
