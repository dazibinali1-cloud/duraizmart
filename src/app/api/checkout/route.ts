import Stripe from "stripe";
import { z } from "zod";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";

export const dynamic = "force-dynamic";

const checkoutSchema = z.object({
  email: z.string().email().default("guest@duraizmart.com"),
  couponCode: z.string().optional().default(""),
  items: z
    .array(
      z.object({
        productId: z.string(),
        name: z.string().min(1),
        price: z.number().nonnegative(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
});

function makeOrderNumber() {
  return `DM-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export async function POST(request: Request) {
  const parsed = checkoutSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: "Invalid checkout payload", issues: parsed.error.flatten() }, { status: 400 });
  }

  const { email, couponCode, items } = parsed.data;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountRate = couponCode.toUpperCase() === "DURAIZVIP" ? 0.15 : couponCode.toUpperCase() === "CHAMPAGNE10" ? 0.1 : 0;
  const discount = subtotal * discountRate;
  const total = subtotal - discount;
  const orderNumber = makeOrderNumber();
  const trackingCode = `TRK-${orderNumber}`;

  try {
    const [order] = await db
      .insert(orders)
      .values({
        orderNumber,
        email,
        status: "pending",
        subtotal: subtotal.toFixed(2),
        discount: discount.toFixed(2),
        total: total.toFixed(2),
        couponCode,
        trackingCode,
        shippingAddress: { concierge: "Duraiz white-glove demo" },
      })
      .returning();

    await db.insert(orderItems).values(
      items.map((item) => ({
        orderId: order.id,
        productId: item.productId.match(/^[0-9a-f-]{36}$/i) ? item.productId : null,
        productName: item.name,
        quantity: item.quantity,
        unitPrice: item.price.toFixed(2),
      })),
    );

    if (process.env.STRIPE_SECRET_KEY) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: email,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/account?order=${orderNumber}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/?cart=cancelled`,
        metadata: { orderNumber },
        line_items: items.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(item.price * 100),
            product_data: { name: item.name },
          },
        })),
      });
      return Response.json({ orderNumber, trackingCode, checkoutUrl: session.url });
    }

    return Response.json({ orderNumber, trackingCode, status: "demo_checkout_created" });
  } catch {
    return Response.json({ orderNumber, trackingCode, status: "demo_checkout_created", warning: "Database order persistence unavailable" });
  }
}
