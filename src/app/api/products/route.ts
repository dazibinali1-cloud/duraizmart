import { NextRequest } from "next/server";
import { searchProducts } from "@/lib/server/catalog-service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const q = params.get("q") ?? "";
  const category = params.get("category") ?? undefined;
  const products = await searchProducts(q, category);
  return Response.json({ products, count: products.length });
}
