import { DuraizHome } from "@/components/duraiz-home";
import { getCatalogSnapshot } from "@/lib/server/catalog-service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const snapshot = await getCatalogSnapshot();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "Duraiz Mart",
    description: "Ultra-premium luxury e-commerce experience with curated fashion, jewelry, home, and elite tech.",
    url: "https://duraizmart.com",
    brand: { "@type": "Brand", name: "Duraiz Mart" },
    sameAs: ["https://duraizmart.com"],
    potentialAction: {
      "@type": "SearchAction",
      target: "https://duraizmart.com/shop?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    makesOffer: snapshot.products.slice(0, 6).map((product) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Product", name: product.name, image: product.images[0] },
      price: product.price,
      priceCurrency: product.currency,
      availability: product.inventory > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <DuraizHome products={snapshot.products} categories={snapshot.categories} source={snapshot.source} />
    </>
  );
}
