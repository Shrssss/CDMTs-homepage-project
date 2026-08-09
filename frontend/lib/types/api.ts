import { z } from "zod";

/* バックエンドとの通信用の型定義・zodを用いたスキーマ */

//アイテムテーブル
export const ItemsSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  storageLocation: z.string(),
  quantity: z.number(),
  isDisposable: z.boolean(),
  isRentable: z.boolean(),
  renterId: z.number().nullable(),
  rentedAt: z.iso.datetime().nullable(),
});
export type Items = z.infer<typeof ItemsSchema>;


//貸出履歴
export const ItemRentalHistoriesSchema = z.object({
  id: z.number(),
  itemId: z.number(),
  renterId: z.number(),
  rentedAt: z.iso.datetime().nullable(),
  returnedAt: z.iso.datetime().nullable(),
});
export type ItemRentalHistories = z.infer<typeof ItemRentalHistoriesSchema>;


//メンバー
export const MembersSchema = z.object({
  id: z.number(),
  name: z.string(),
  studentId: z.number(),
  email: z.string(),
  grade: z.number(),
  position: z.string().nullable(),
  //passwordHash: z.string(), passwordHash isn't needed in frontend?If not, remove it.
  createdAt: z.iso.datetime().nullable(),
  updatedAt: z.iso.datetime().nullable(),
});
export type Members = z.infer<typeof MembersSchema>;


//メンバーの技術
export const MemberTechnologiesSchema = z.object({
  memberId: z.number(),
  technologyId: z.number(),
});
export type MemberTechnologies = z.infer<typeof MemberTechnologiesSchema>;


//ニュース
export const NewsSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  thumbnailPath: z.string().optional(),
  category: z.string(),
  isPublished: z.boolean(),
  createdAt: z.iso.datetime().nullable(),
  updatedAt: z.iso.datetime().nullable(),
});
export type News = z.infer<typeof NewsSchema>;


//技術
export const TechnologiesSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
});
export type Technologies = z.infer<typeof TechnologiesSchema>;

export const ItemResponseSchema = z.array(z.object({
  id: z.number(),
  name: z.number(),
  storageLocation: z.number(),
  isDisposable: z.boolean(),
  isRentable: z.boolean()
}))

export const ItemDetailResponseSchema = z.array(z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  storageLocation: z.string(),
  quantity: z.string(),
  isDisposable: z.boolean(),
  isRentable: z.boolean(),
  renterId: z.boolean()
}))

export const MembersResponseSchema = z.array(z.object({
  id: z.number(),
  name: z.string(),
  grade: z.number(),
  position: z.string()
}))

export const TechnologiesResponseSchema = z.object({
  id: z.number(),
  name: z.string()
})

export const MemberDetailResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  grade: z.number(),
  position: z.string(),
  technologies: z.array(TechnologiesResponseSchema)
})

export const NewsResponseSchema = z.array(z.object({
  title: z.string(),
  thumbnailPath: z.string(),
  category: z.string(),
  isPublished: z.boolean(),
  createdAt: z.date()
}))

export const NewsDetailResponseSchema = z.object({
  title: z.string(),
  content: z.string(),
  thumbnailPath: z.string(),
  category: z.string(),
  isPublished: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const TechnologyResponseSchema = z.array(z.object({
  id: z.number(),
  name: z.string(),
}))

export const TechnologyDetailResponseSchema = z.object({
  id: z.number(),
  name: z.number(),
  description: z.number()
})