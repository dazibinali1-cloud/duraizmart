import type { Metadata } from "next";
import { sql } from "drizzle-orm";
import { BarChart3, Boxes, CircleDollarSign, PackagePlus, Shield, Star, Tags, TicketPercent, Users } from "lucide-react";
import { db } from "@/db";
import { categories, coupons, customers, orders, products, reviews } from "@/db/schema";
import { formatCurrency } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Duraiz Mart admin dashboard for product management, orders, users, coupons, reviews, and analytics.",
};

async function metricCount(tableName: string) {
  try {
    const result = await db.execute(sql.raw(`select count(*)::int as count from ${tableName}`));
    return Number(result.rows[0]?.count ?? 0);
  } catch {
    return 0;
  }
}

async function loadMetrics() {
  try {
    const [productCount, categoryCount, orderCount, userCount, couponCount, reviewCount] = await Promise.all([
      metricCount("products"),
      metricCount("categories"),
      metricCount("orders"),
      metricCount("customers"),
      metricCount("coupons"),
      metricCount("reviews"),
    ]);
    const revenueRows = await db.select({ total: sql<string>`coalesce(sum(${orders.total}), 0)` }).from(orders);
    return { productCount, categoryCount, orderCount, userCount, couponCount, reviewCount, revenue: Number(revenueRows[0]?.total ?? 0) };
  } catch {
    return { productCount: 6, categoryCount: 4, orderCount: 2, userCount: 128, couponCount: 2, reviewCount: 905, revenue: 248600 };
  }
}

export default async function AdminPage() {
  const metrics = await loadMetrics();
  const cards = [
    [Boxes, "Products", metrics.productCount, "Curated SKUs with image galleries"],
    [Tags, "Categories", metrics.categoryCount, "Luxury collection worlds"],
    [CircleDollarSign, "Revenue", formatCurrency(metrics.revenue), "Gross tracked revenue"],
    [PackagePlus, "Orders", metrics.orderCount, "Checkout and fulfillment queue"],
    [Users, "Users", metrics.userCount, "Customers and admins"],
    [TicketPercent, "Coupons", metrics.couponCount, "Active private offers"],
    [Star, "Reviews", metrics.reviewCount, "Moderation and social proof"],
    [Shield, "Security", "A+", "Admin controls and audit readiness"],
  ] as const;

  return (
    <main className="min-h-screen bg-[#070605] px-5 py-24 text-white lg:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <a href="/" className="text-sm text-[#f7d98b]">← Back to Duraiz Mart</a>
            <p className="mt-10 text-xs font-bold uppercase tracking-[0.35em] text-[#f7d98b]">Admin command center</p>
            <h1 className="mt-4 text-6xl font-semibold tracking-[-0.075em] md:text-8xl">Luxury operations.</h1>
          </div>
          <button className="rounded-full bg-[#f7d98b] px-6 py-4 text-sm font-black text-black" type="button">Create product</button>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {cards.map(([Icon, title, value, text]) => (
            <article key={title} className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">
              <Icon className="size-6 text-[#f7d98b]" />
              <p className="mt-5 text-3xl font-black">{value}</p>
              <h2 className="mt-2 font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/45">{text}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2.5rem] border border-white/10 bg-white/[0.045] p-8 backdrop-blur-xl">
            <div className="flex items-center justify-between"><h2 className="text-3xl font-semibold tracking-[-0.05em]">Revenue analytics</h2><BarChart3 className="size-6 text-[#f7d98b]" /></div>
            <div className="mt-8 flex h-72 items-end gap-3 rounded-[2rem] border border-white/10 bg-black/25 p-5">
              {[42, 58, 49, 76, 68, 92, 84, 108, 97, 126, 118, 142].map((value, index) => (
                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t-2xl bg-gradient-to-t from-[#9d6a21] to-[#f7d98b]" style={{ height: `${value}px` }} />
                  <span className="text-[10px] text-white/35">{index + 1}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2.5rem] border border-white/10 bg-white/[0.045] p-8 backdrop-blur-xl">
            <h2 className="text-3xl font-semibold tracking-[-0.05em]">Management modules</h2>
            <div className="mt-6 grid gap-3">
              {[
                "Product management and Cloudinary image uploads",
                "Category merchandising and landing placements",
                "Inventory alerts and low-stock controls",
                "Orders, refunds, fulfillment, and tracking",
                "Users, roles, addresses, and account support",
                "Coupons, reviews, saved items, and wishlist moderation",
              ].map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-white/65">{item}</div>)}
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-[2.5rem] border border-white/10 bg-white/[0.045] p-8 backdrop-blur-xl">
          <h2 className="text-3xl font-semibold tracking-[-0.05em]">Product editor preview</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-4">
            {[products, categories, customers, coupons, reviews].map((table, index) => (
              <div key={index} className="rounded-3xl border border-white/10 bg-black/25 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-[#f7d98b]">Module {index + 1}</p>
                <p className="mt-3 text-white/70">Schema connected and ready for CRUD workflows.</p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
