import { asc, desc, ilike, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { demoCategories, demoProducts, type CategoryView, type ProductView } from "@/lib/catalog";

function toNumber(value: unknown, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function mapProduct(row: typeof products.$inferSelect): ProductView {
  return {
    id: row.id,
    categoryId: row.categoryId ?? "",
    name: row.name,
    slug: row.slug,
    subtitle: row.subtitle,
    description: row.description,
    price: toNumber(row.price),
    compareAtPrice: row.compareAtPrice ? toNumber(row.compareAtPrice) : undefined,
    currency: row.currency,
    rating: toNumber(row.rating, 5),
    reviewCount: row.reviewCount,
    inventory: row.inventory,
    badge: row.badge,
    tags: row.tags,
    images: row.images,
    details: row.details,
    isTrending: row.isTrending,
    isNewArrival: row.isNewArrival,
    isFlashDeal: row.isFlashDeal,
  };
}

function mapCategory(row: typeof categories.$inferSelect): CategoryView {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    imageUrl: row.imageUrl,
    accent: row.accent,
    featured: row.featured,
  };
}

async function ensureDemoCatalog() {
  const [productCountRow] = await db.select({ count: sql<number>`count(*)` }).from(products);
  if (Number(productCountRow?.count ?? 0) > 0) return;

  const categoryRows = await db
    .insert(categories)
    .values(
      demoCategories.map((category) => ({
        name: category.name,
        slug: category.slug,
        description: category.description,
        imageUrl: category.imageUrl,
        accent: category.accent,
        featured: category.featured,
      })),
    )
    .onConflictDoNothing()
    .returning();

  const existingCategories = categoryRows.length ? categoryRows : await db.select().from(categories);
  const idBySlug = new Map(existingCategories.map((category) => [category.slug, category.id]));
  const slugByDemoId = new Map(demoCategories.map((category) => [category.id, category.slug]));

  await db
    .insert(products)
    .values(
      demoProducts.map((product) => ({
        categoryId: idBySlug.get(slugByDemoId.get(product.categoryId) ?? "") ?? null,
        name: product.name,
        slug: product.slug,
        subtitle: product.subtitle,
        description: product.description,
        price: product.price.toFixed(2),
        compareAtPrice: product.compareAtPrice ? product.compareAtPrice.toFixed(2) : null,
        currency: product.currency,
        rating: product.rating.toFixed(2),
        reviewCount: product.reviewCount,
        inventory: product.inventory,
        badge: product.badge,
        tags: product.tags,
        images: product.images,
        details: product.details,
        isTrending: product.isTrending,
        isNewArrival: product.isNewArrival,
        isFlashDeal: product.isFlashDeal,
        active: true,
      })),
    )
    .onConflictDoNothing();
}

export async function getCatalogSnapshot() {
  try {
    await ensureDemoCatalog();
    const [categoryRows, productRows] = await Promise.all([
      db.select().from(categories).orderBy(asc(categories.name)),
      db.select().from(products).where(sql`${products.active} = true`).orderBy(desc(products.createdAt)),
    ]);

    return {
      categories: categoryRows.length ? categoryRows.map(mapCategory) : demoCategories,
      products: productRows.length ? productRows.map(mapProduct) : demoProducts,
      source: productRows.length ? "database" : "curated-demo",
    } as const;
  } catch {
    return { categories: demoCategories, products: demoProducts, source: "curated-demo" } as const;
  }
}

export async function searchProducts(query: string, category?: string) {
  const normalized = query.trim();
  try {
    const rows = await db
      .select()
      .from(products)
      .where(
        normalized
          ? or(
              ilike(products.name, `%${normalized}%`),
              ilike(products.subtitle, `%${normalized}%`),
              ilike(products.description, `%${normalized}%`),
            )
          : sql`${products.active} = true`,
      )
      .limit(24);

    const mapped = rows.map(mapProduct).filter((product) => (category ? product.categoryId === category : true));
    return mapped.length ? mapped : filterDemoProducts(normalized, category);
  } catch {
    return filterDemoProducts(normalized, category);
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const rows = await db.select().from(products).where(sql`${products.slug} = ${slug}`).limit(1);
    if (rows[0]) return mapProduct(rows[0]);
  } catch {
    // fall through to demo catalog
  }
  return demoProducts.find((product) => product.slug === slug) ?? null;
}

function filterDemoProducts(query: string, category?: string) {
  const q = query.toLowerCase();
  return demoProducts.filter((product) => {
    const matchesQuery = q
      ? [product.name, product.subtitle, product.description, product.tags.join(" ")].join(" ").toLowerCase().includes(q)
      : true;
    const matchesCategory = category ? product.categoryId === category : true;
    return matchesQuery && matchesCategory;
  });
}
