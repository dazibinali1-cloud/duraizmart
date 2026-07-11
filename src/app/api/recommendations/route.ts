import { NextRequest } from "next/server";
import { getCatalogSnapshot } from "@/lib/server/catalog-service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const tags = request.nextUrl.searchParams.get("tags")?.split(",").filter(Boolean) ?? [];
  const { products } = await getCatalogSnapshot();
  const scored = products
    .map((product) => ({
      product,
      score:
        product.tags.reduce((sum, tag) => sum + (tags.includes(tag) ? 4 : 0), 0) +
        (product.isTrending ? 2 : 0) +
        (product.isNewArrival ? 1 : 0) +
        product.rating,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(({ product, score }) => ({ ...product, recommendationScore: Number(score.toFixed(2)) }));

  return Response.json({ recommendations: scored });
}
