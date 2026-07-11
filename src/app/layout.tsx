import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://duraizmart.com"),
  title: {
    default: "Duraiz Mart — Ultra-Premium Luxury E-Commerce",
    template: "%s | Duraiz Mart",
  },
  description:
    "Duraiz Mart is an original premium e-commerce experience for luxury fashion, jewelry, signature home, and elite technology.",
  keywords: ["Duraiz Mart", "luxury e-commerce", "premium shopping", "designer marketplace", "black champagne commerce"],
  applicationName: "Duraiz Mart",
  authors: [{ name: "Duraiz Mart" }],
  creator: "Duraiz Mart",
  publisher: "Duraiz Mart",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Duraiz Mart",
    title: "Duraiz Mart — Ultra-Premium Luxury E-Commerce",
    description: "A cinematic, interactive luxury shopping experience with curated products and concierge commerce.",
    url: "https://duraizmart.com",
    images: [
      {
        url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85",
        width: 1200,
        height: 630,
        alt: "Duraiz Mart luxury shopping preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Duraiz Mart",
    description: "Ultra-premium luxury e-commerce experience.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#070605",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#070605] text-white antialiased selection:bg-[#f7d98b] selection:text-black">{children}</body>
    </html>
  );
}
