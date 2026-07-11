import type { Metadata } from "next";
import { formatCurrency, productDiscount } from "@/lib/catalog";
import { getCatalogSnapshot } from "@/lib/server/catalog-service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop Luxury Collections",
  description: "Shop Duraiz Mart curated luxury fashion, watches, home, fragrance, and elite technology.",
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const [{ q = "" }, snapshot] = await Promise.all([searchParams, getCatalogSnapshot()]);
  const query = q.toLowerCase();
  const products = snapshot.products.filter((product) =>
    query ? [product.name, product.subtitle, product.description, product.tags.join(" ")].join(" ").toLowerCase().includes(query) : true,
  );

  return (
    <main className="min-h-screen bg-[#070605] px-5 py-24 text-white lg:px-8">
      <section className="mx-auto max-w-7xl">
        <a href="/" className="text-sm text-[#f7d98b]">← Back to Duraiz Mart</a>
        <div className="mt-10 rounded-[2.5rem] border border-white/10 bg-white/[0.045] p-8 backdrop-blur-xl">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#f7d98b]">Shop</p>
          <h1 className="mt-4 text-6xl font-semibold tracking-[-0.07em]">Luxury catalog</h1>
          <form className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input name="q" defaultValue={q} placeholder="Search Duraiz Mart" className="flex-1 rounded-full border border-white/10 bg-black/35 px-5 py-4 outline-none focus:border-[#f7d98b]/50" />
            <button className="rounded-full bg-[#f7d98b] px-8 py-4 font-black text-black" type="submit">Search</button>
          </form>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <article key={product.id} className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045]">
              <img src={product.images[0]} alt={product.name} className="aspect-[4/5] w-full object-cover" />
              <div className="p-5">
                <div className="flex items-center justify-between text-xs text-[#f7d98b]"><span>{product.badge}</span><span>{productDiscount(product) ? `-${productDiscount(product)}%` : "Curated"}</span></div>
                <h2 className="mt-3 text-xl font-semibold tracking-[-0.04em]">{product.name}</h2>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/50">{product.subtitle}</p>
                <p className="mt-4 text-2xl font-black">{formatCurrency(product.price)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
