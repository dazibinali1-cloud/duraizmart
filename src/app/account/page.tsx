import type { Metadata } from "next";
import { PackageCheck, ShieldCheck, Truck, UserRound } from "lucide-react";

export const metadata: Metadata = {
  title: "Account & Order Tracking",
  description: "Manage your Duraiz Mart profile, addresses, wishlist, saved items, and luxury order tracking.",
};

const orders = [
  { id: "DM-2026-AURUM", status: "Concierge packaging", total: "$3,420", item: "Aurum Eclipse Automatic" },
  { id: "DM-2026-OUD", status: "Delivered", total: "$310", item: "Velvet Oud Parfum Extrait" },
];

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-[#070605] px-5 py-24 text-white lg:px-8">
      <section className="mx-auto max-w-7xl">
        <a href="/" className="text-sm text-[#f7d98b]">← Back to Duraiz Mart</a>
        <div className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="rounded-[2.5rem] border border-white/10 bg-white/[0.045] p-8 backdrop-blur-xl">
            <div className="grid size-20 place-items-center rounded-3xl bg-[#f7d98b] text-black"><UserRound className="size-9" /></div>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.35em] text-[#f7d98b]">Customer portal</p>
            <h1 className="mt-3 text-5xl font-semibold tracking-[-0.07em]">Your private room.</h1>
            <p className="mt-4 leading-7 text-white/55">Register, login, manage profile details, save addresses, track orders, and revisit your wishlist in one polished account space.</p>
            <form className="mt-8 grid gap-3">
              <input placeholder="Email address" type="email" className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 outline-none focus:border-[#f7d98b]/50" />
              <input placeholder="Password" type="password" className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 outline-none focus:border-[#f7d98b]/50" />
              <button type="button" className="rounded-full bg-[#f7d98b] px-5 py-3 font-black text-black">Login / Register</button>
            </form>
          </aside>
          <div className="grid gap-6">
            <div className="grid gap-5 md:grid-cols-3">
              {[
                [ShieldCheck, "Black tier", "Encrypted profile and saved addresses"],
                [PackageCheck, "Saved items", "12 wishlist and recently viewed products"],
                [Truck, "Tracking", "Live order timeline with concierge status"],
              ].map(([Icon, title, text]) => {
                const TypedIcon = Icon as typeof ShieldCheck;
                return <div key={title as string} className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6"><TypedIcon className="size-6 text-[#f7d98b]" /><h2 className="mt-4 font-semibold">{title as string}</h2><p className="mt-2 text-sm leading-6 text-white/48">{text as string}</p></div>;
              })}
            </div>
            <section className="rounded-[2.5rem] border border-white/10 bg-white/[0.045] p-8 backdrop-blur-xl">
              <h2 className="text-3xl font-semibold tracking-[-0.05em]">Order history</h2>
              <div className="mt-6 grid gap-4">
                {orders.map((order) => (
                  <div key={order.id} className="grid gap-3 rounded-3xl border border-white/10 bg-black/25 p-5 md:grid-cols-4 md:items-center">
                    <span className="font-semibold text-[#f7d98b]">{order.id}</span>
                    <span className="text-white/70">{order.item}</span>
                    <span className="text-white/45">{order.status}</span>
                    <span className="font-black md:text-right">{order.total}</span>
                  </div>
                ))}
              </div>
            </section>
            <section className="rounded-[2.5rem] border border-white/10 bg-white/[0.045] p-8 backdrop-blur-xl">
              <h2 className="text-3xl font-semibold tracking-[-0.05em]">Saved address</h2>
              <p className="mt-4 rounded-3xl border border-white/10 bg-black/25 p-5 text-white/60">Maison Suite, 18 Champagne Avenue, Dubai — default white-glove delivery destination.</p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
