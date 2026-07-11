import { eq, or } from "drizzle-orm";
import { NextRequest } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";

export const dynamic = "force-dynamic";

const demoTimeline = [
  { label: "Order received", complete: true },
  { label: "Concierge packaging", complete: true },
  { label: "Priority dispatch", complete: false },
  { label: "Delivered", complete: false },
];

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code") ?? "";
  if (!code) return Response.json({ error: "Tracking code is required" }, { status: 400 });

  try {
    const [order] = await db
      .select()
      .from(orders)
      .where(or(eq(orders.orderNumber, code), eq(orders.trackingCode, code)))
      .limit(1);

    if (order) {
      return Response.json({
        orderNumber: order.orderNumber,
        trackingCode: order.trackingCode,
        status: order.status,
        total: order.total,
        timeline: demoTimeline.map((step, index) => ({ ...step, complete: index <= 1 || order.status === "delivered" })),
      });
    }
  } catch {
    // demo response below
  }

  return Response.json({ orderNumber: code.replace("TRK-", ""), trackingCode: code, status: "processing", timeline: demoTimeline });
}
