import type { MetadataRoute } from "next";
import { getCatalogSnapshot } from "@/lib/server/catalog-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://duraizmart.com";
  const { products } = await getCatalogSnapshot();
  const staticRoutes: MetadataRoute.Sitemap = ["", "/shop", "/account", "/admin"].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.75,
  }));

  return [
    ...staticRoutes,
    ...products.map((product) => ({
      url: `${base}/products/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
