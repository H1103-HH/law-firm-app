import { pgTable, serial, timestamp, varchar, text, integer, jsonb, index, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { createSchemaFactory } from "drizzle-zod"
import { z } from "zod"

// 保留系统表
export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// 用户表
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openid: varchar("openid", { length: 255 }).notNull().unique(),
  unionid: varchar("unionid", { length: 255 }),
  nickname: varchar("nickname", { length: 100 }),
  avatar: varchar("avatar", { length: 500 }),
  role: varchar("role", { length: 20 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
  index("users_openid_idx").on(table.openid),
  index("users_role_idx").on(table.role),
]);

// 管理员表
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
  index("admins_username_idx").on(table.username),
])

// 律师信息表
export const lawyers = pgTable("lawyers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  title: varchar("title", { length: 100 }).notNull(),
  avatar: varchar("avatar", { length: 500 }).notNull(),
  location: varchar("location", { length: 100 }).notNull(),
  specialties: text("specialties").notNull(), // 改为文本
  description: text("description").notNull(),
  achievements: text("achievements").notNull(), // 改为文本
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 200 }),
  website: varchar("website", { length: 500 }),
  cases: text("cases").notNull(), // 改为文本
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
  index("lawyers_name_idx").on(table.name),
  index("lawyers_location_idx").on(table.location),
  index("lawyers_is_active_idx").on(table.isActive),
])

// 浏览记录表
export const viewedLawyers = pgTable("viewed_lawyers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  lawyerId: integer("lawyer_id").notNull().references(() => lawyers.id),
  viewedAt: timestamp("viewed_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  index("viewed_lawyers_user_id_idx").on(table.userId),
  index("viewed_lawyers_lawyer_id_idx").on(table.lawyerId),
  index("viewed_lawyers_user_lawyer_idx").on(table.userId, table.lawyerId),
])

// Zod Schemas for validation
const { createInsertSchema: createCoercedInsertSchema } = createSchemaFactory({
  coerce: { date: true },
})

export const insertUserSchema = createCoercedInsertSchema(users).pick({
  openid: true,
  unionid: true,
  nickname: true,
  avatar: true,
  role: true,
})

export const insertAdminSchema = createCoercedInsertSchema(admins).pick({
  username: true,
  password: true,
  name: true,
})

export const insertLawyerSchema = createCoercedInsertSchema(lawyers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const updateLawyerSchema = createCoercedInsertSchema(lawyers)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial()

// TypeScript types
export type User = typeof users.$inferSelect
export type InsertUser = z.infer<typeof insertUserSchema>
export type Admin = typeof admins.$inferSelect
export type Lawyer = typeof lawyers.$inferSelect
export type InsertLawyer = z.infer<typeof insertLawyerSchema>
export type UpdateLawyer = z.infer<typeof updateLawyerSchema>
export type ViewedLawyer = typeof viewedLawyers.$inferSelect

