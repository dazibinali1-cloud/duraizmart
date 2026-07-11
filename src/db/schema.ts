import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

export const userRoleEnum = pgEnum("user_role", ["customer", "admin"]);

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 120 }).notNull(),
    slug: varchar("slug", { length: 140 }).notNull(),
    description: text("description").notNull().default(""),
    imageUrl: text("image_url").notNull().default(""),
    accent: varchar("accent", { length: 80 }).notNull().default("champagne"),
    featured: boolean("featured").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("categories_slug_idx").on(table.slug)],
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
    name: varchar("name", { length: 180 }).notNull(),
    slug: varchar("slug", { length: 220 }).notNull(),
    subtitle: varchar("subtitle", { length: 220 }).notNull().default(""),
    description: text("description").notNull().default(""),
    price: numeric("price", { precision: 12, scale: 2 }).notNull(),
    compareAtPrice: numeric("compare_at_price", { precision: 12, scale: 2 }),
    currency: varchar("currency", { length: 8 }).notNull().default("USD"),
    rating: numeric("rating", { precision: 3, scale: 2 }).notNull().default("5.00"),
    reviewCount: integer("review_count").notNull().default(0),
    inventory: integer("inventory").notNull().default(0),
    badge: varchar("badge", { length: 80 }).notNull().default(""),
    tags: jsonb("tags").$type<string[]>().notNull().default([]),
    images: jsonb("images").$type<string[]>().notNull().default([]),
    details: jsonb("details").$type<Record<string, string>>().notNull().default({}),
    isTrending: boolean("is_trending").notNull().default(false),
    isNewArrival: boolean("is_new_arrival").notNull().default(false),
    isFlashDeal: boolean("is_flash_deal").notNull().default(false),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("products_slug_idx").on(table.slug),
    index("products_category_idx").on(table.categoryId),
    index("products_trending_idx").on(table.isTrending),
  ],
);

export const customers = pgTable(
  "customers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 160 }).notNull(),
    email: varchar("email", { length: 220 }).notNull(),
    passwordHash: text("password_hash").notNull().default(""),
    imageUrl: text("image_url").notNull().default(""),
    role: userRoleEnum("role").notNull().default("customer"),
    loyaltyTier: varchar("loyalty_tier", { length: 60 }).notNull().default("Black"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("customers_email_idx").on(table.email)],
);

export const addresses = pgTable(
  "addresses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    customerId: uuid("customer_id").notNull().references(() => customers.id, { onDelete: "cascade" }),
    label: varchar("label", { length: 80 }).notNull().default("Home"),
    fullName: varchar("full_name", { length: 180 }).notNull(),
    line1: varchar("line_1", { length: 220 }).notNull(),
    line2: varchar("line_2", { length: 220 }).notNull().default(""),
    city: varchar("city", { length: 120 }).notNull(),
    region: varchar("region", { length: 120 }).notNull().default(""),
    postalCode: varchar("postal_code", { length: 40 }).notNull(),
    country: varchar("country", { length: 80 }).notNull(),
    isDefault: boolean("is_default").notNull().default(false),
  },
  (table) => [index("addresses_customer_idx").on(table.customerId)],
);

export const coupons = pgTable(
  "coupons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: varchar("code", { length: 60 }).notNull(),
    description: text("description").notNull().default(""),
    percentOff: integer("percent_off").notNull().default(0),
    active: boolean("active").notNull().default(true),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("coupons_code_idx").on(table.code)],
);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    customerId: uuid("customer_id").references(() => customers.id, { onDelete: "set null" }),
    orderNumber: varchar("order_number", { length: 80 }).notNull(),
    email: varchar("email", { length: 220 }).notNull(),
    status: orderStatusEnum("status").notNull().default("pending"),
    subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
    discount: numeric("discount", { precision: 12, scale: 2 }).notNull().default("0"),
    total: numeric("total", { precision: 12, scale: 2 }).notNull(),
    couponCode: varchar("coupon_code", { length: 60 }).notNull().default(""),
    stripeSessionId: text("stripe_session_id").notNull().default(""),
    trackingCode: varchar("tracking_code", { length: 80 }).notNull().default(""),
    shippingAddress: jsonb("shipping_address").$type<Record<string, string>>().notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("orders_order_number_idx").on(table.orderNumber), index("orders_email_idx").on(table.email)],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
    productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
    productName: varchar("product_name", { length: 180 }).notNull(),
    quantity: integer("quantity").notNull().default(1),
    unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
  },
  (table) => [index("order_items_order_idx").on(table.orderId)],
);

export const wishlistItems = pgTable(
  "wishlist_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    customerId: uuid("customer_id").references(() => customers.id, { onDelete: "cascade" }),
    productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    sessionId: varchar("session_id", { length: 120 }).notNull().default("guest"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("wishlist_session_idx").on(table.sessionId)],
);

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    customerName: varchar("customer_name", { length: 160 }).notNull(),
    rating: integer("rating").notNull().default(5),
    title: varchar("title", { length: 180 }).notNull().default(""),
    body: text("body").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("reviews_product_idx").on(table.productId)],
);

export const analyticsEvents = pgTable("analytics_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  event: varchar("event", { length: 120 }).notNull(),
  payload: jsonb("payload").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Category = InferSelectModel<typeof categories>;
export type Product = InferSelectModel<typeof products>;
export type NewProduct = InferInsertModel<typeof products>;
export type Coupon = InferSelectModel<typeof coupons>;
export type Order = InferSelectModel<typeof orders>;
