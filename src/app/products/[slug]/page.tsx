import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatCurrency, productDiscount } from "@/lib/catalog";
import { getCatalogSnapshot, getProductBySlug } from "@/lib/server/catalog-service";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description,
    openGraph: { title: product.name, description: product.description, images: [{ url: product.images[0], alt: product.name }] },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, snapshot] = await Promise.all([getProductBySlug(slug), getCatalogSnapshot()]);
  if (!product) notFound();
  const related = snapshot.products.filter((item) => item.id !== product.id && item.categoryId === product.categoryId).slice(0, 3);

  return (
    <main className="min-h-screen bg-[#070605] px-5 py-24 text-white lg:px-8">
      <section className="mx-auto max-w-7xl">
        <a href="/" className="text-sm text-[#f7d98b]">← Back to Duraiz Mart</a>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-4 md:grid-cols-2">
            {product.images.map((image) => <img key={image} src={image} alt={product.name} className="aspect-[4/5] rounded-[2rem] object-cover" />)}
          </div>
          <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.045] p-8 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#f7d98b]">{product.badge || "Duraiz product"}</p>
            <h1 className="mt-4 text-6xl font-semibold tracking-[-0.075em]">{product.name}</h1>
            <p className="mt-5 text-xl leading-8 text-white/62">{product.description}</p>
            <div className="mt-7 flex items-center gap-4"><span className="text-4xl font-black">{formatCurrency(product.price)}</span>{product.compareAtPrice && <span className="text-white/35 line-through">{formatCurrency(product.compareAtPrice)}</span>}{productDiscount(product) > 0 && <span className="rounded-full bg-[#f7d98b] px-3 py-1 text-xs font-black text-black">-{productDiscount(product)}%</span>}</div>
            <dl className="mt-8 grid gap-3 sm:grid-cols-2">
              {Object.entries(product.details).map(([key, value]) => <div key={key} className="rounded-2xl border border-white/10 bg-black/25 p-4"><dt className="text-xs uppercase tracking-[0.24em] text-white/35">{key}</dt><dd className="mt-1 text-sm text-white/75">{value}</dd></div>)}
            </dl>
            <button className="mt-8 w-full rounded-full bg-[#f7d98b] px-6 py-4 font-black text-black" type="button">Add to cart</button>
          </div>
        </div>
        <section className="mt-16">
          <h2 className="text-4xl font-semibold tracking-[-0.06em]">Related products</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {related.map((item) => <a key={item.id} href={`/products/${item.slug}`} className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-4"><img src={item.images[0]} alt={item.name} className="aspect-square rounded-[1.5rem] object-cover" /><h3 className="mt-4 font-semibold">{item.name}</h3><p className="mt-1 text-[#f7d98b]">{formatCurrency(item.price)}</p></a>)}
          </div>
        </section>
      </section>
    </main>
  );
}
