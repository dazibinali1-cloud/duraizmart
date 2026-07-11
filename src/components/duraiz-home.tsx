"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  BarChart3,
  Boxes,
  ChevronRight,
  CreditCard,
  Crown,
  Heart,
  Menu,
  PackageCheck,
  Search,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  UserRound,
  WandSparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  demoProducts,
  formatCurrency,
  productDiscount,
  testimonials,
  type CategoryView,
  type ProductView,
} from "@/lib/catalog";

type CartLine = { product: ProductView; quantity: number };
type CatAction = "wink" | "jump" | "wave" | "heart" | "sparkle" | "meow" | "roll" | "nap";

type Props = {
  products: ProductView[];
  categories: CategoryView[];
  source: string;
};

const navItems = ["Maison", "Collections", "Deals", "Concierge", "Admin"];
const catActions: CatAction[] = ["wink", "jump", "wave", "heart", "sparkle", "meow", "roll", "nap"];

function LuxuryOrb() {
  const mesh = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);

  useFrame(({ clock, pointer }) => {
    const time = clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.rotation.x = time * 0.22 + pointer.y * 0.15;
      mesh.current.rotation.y = time * 0.35 + pointer.x * 0.25;
      mesh.current.position.y = Math.sin(time * 0.9) * 0.12;
    }
    if (halo.current) {
      halo.current.rotation.z = -time * 0.18;
      halo.current.scale.setScalar(1.15 + Math.sin(time) * 0.03);
    }
  });

  return (
    <group>
      <mesh ref={halo}>
        <torusGeometry args={[1.5, 0.018, 16, 120]} />
        <meshStandardMaterial color="#f7d77b" emissive="#7b5417" emissiveIntensity={0.85} metalness={1} roughness={0.22} />
      </mesh>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[0.92, 4]} />
        <meshPhysicalMaterial
          color="#17100a"
          clearcoat={1}
          emissive="#1d1308"
          metalness={0.72}
          roughness={0.18}
          transmission={0.18}
        />
      </mesh>
      <pointLight color="#f8d88c" intensity={5} position={[1.8, 2.4, 2.5]} />
      <pointLight color="#ffffff" intensity={1.4} position={[-2, -1, 2]} />
    </group>
  );
}

function HeroCanvas() {
  return (
    <div className="pointer-events-none absolute inset-y-16 right-0 hidden w-[48%] opacity-90 lg:block">
      <Canvas camera={{ position: [0, 0, 4], fov: 42 }} dpr={[1, 1.45]}>
        <ambientLight intensity={0.45} />
        <LuxuryOrb />
      </Canvas>
    </div>
  );
}

function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 520, damping: 36, mass: 0.35 });
  const springY = useSpring(cursorY, { stiffness: 520, damping: 36, mass: 0.35 });
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;
    document.documentElement.classList.add("luxury-cursor");
    const move = (event: PointerEvent) => {
      cursorX.set(event.clientX - 18);
      cursorY.set(event.clientY - 18);
      setVisible(true);
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      document.documentElement.classList.remove("luxury-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden size-9 rounded-full border border-[#f7d98b]/70 bg-[#f7d98b]/10 shadow-[0_0_28px_rgba(247,217,139,0.45)] backdrop-blur-md md:block"
      style={{ x: springX, y: springY, opacity: visible ? 1 : 0 }}
      animate={{ scale: pressed ? 0.72 : 1 }}
    >
      <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f7d98b]" />
    </motion.div>
  );
}

function CatCompanion({ enabled }: { enabled: boolean }) {
  const x = useMotionValue(80);
  const y = useMotionValue(140);
  const springX = useSpring(x, { stiffness: 82, damping: 18, mass: 0.65 });
  const springY = useSpring(y, { stiffness: 82, damping: 18, mass: 0.65 });
  const rotate = useTransform(springX, [0, 1200], [-7, 7]);
  const [action, setAction] = useState<CatAction | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const move = (event: PointerEvent) => {
      x.set(event.clientX + 26);
      y.set(event.clientY + 28);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [enabled, x, y]);

  useEffect(() => {
    if (!enabled) return;
    const interval = window.setInterval(() => {
      setAction((current) => current ?? (Math.random() > 0.58 ? "nap" : "sparkle"));
      window.setTimeout(() => setAction(null), 1500);
    }, 9000);
    return () => window.clearInterval(interval);
  }, [enabled]);

  if (!enabled) return null;

  const trigger = () => {
    const next = catActions[Math.floor(Math.random() * catActions.length)];
    setAction(next);
    window.setTimeout(() => setAction(null), 1500);
  };

  return (
    <motion.button
      aria-label="Play with Duraiz cat companion"
      type="button"
      onClick={trigger}
      className="fixed z-[80] hidden select-none items-center justify-center md:flex"
      style={{ x: springX, y: springY, rotate }}
      animate={{ y: action === "jump" ? -26 : 0, rotate: action === "roll" ? 360 : undefined }}
      transition={{ type: "spring", stiffness: 210, damping: 16 }}
    >
      <span className="relative block size-20 drop-shadow-[0_18px_30px_rgba(0,0,0,0.42)]">
        <motion.span
          className="absolute left-4 top-0 size-6 rounded-[45%_70%_35%_70%] bg-[#1b1512] ring-1 ring-[#f2cf7d]/30"
          animate={{ rotate: action === "wave" ? [-12, 28, -8] : [-4, 5, -4] }}
          transition={{ repeat: Infinity, duration: action === "wave" ? 0.55 : 2.2 }}
        />
        <motion.span
          className="absolute right-4 top-0 size-6 rounded-[70%_45%_70%_35%] bg-[#1b1512] ring-1 ring-[#f2cf7d]/30"
          animate={{ rotate: [-5, 4, -5] }}
          transition={{ repeat: Infinity, duration: 2.6 }}
        />
        <span className="absolute left-2 top-3 size-16 rounded-[42%] bg-gradient-to-br from-[#241b18] to-[#090807] ring-1 ring-[#f2cf7d]/35" />
        <span className="absolute left-[24px] top-[33px] size-3 rounded-full bg-[#f3d37c]">
          <motion.span
            className="absolute left-[5px] top-0 h-3 w-1 rounded-full bg-black"
            animate={{ scaleY: action === "wink" ? [1, 0.1, 1] : [1, 1, 0.08, 1] }}
            transition={{ repeat: Infinity, duration: action === "wink" ? 0.9 : 4.6 }}
          />
        </span>
        <span className="absolute right-[24px] top-[33px] size-3 rounded-full bg-[#f3d37c]">
          <motion.span
            className="absolute left-[5px] top-0 h-3 w-1 rounded-full bg-black"
            animate={{ scaleY: [1, 1, 0.08, 1] }}
            transition={{ repeat: Infinity, duration: 4.2, delay: 0.4 }}
          />
        </span>
        <span className="absolute left-[36px] top-[47px] h-1.5 w-2 rounded-full bg-[#d7a65a]" />
        <motion.span
          className="absolute -right-2 bottom-3 h-3 w-12 origin-left rounded-full bg-[#16100e] ring-1 ring-[#f2cf7d]/20"
          animate={{ rotate: [-20, 28, -18] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
        />
        <AnimatePresence>
          {action && (
            <motion.span
              initial={{ opacity: 0, y: 8, scale: 0.8 }}
              animate={{ opacity: 1, y: -14, scale: 1 }}
              exit={{ opacity: 0, y: -32, scale: 0.9 }}
              className="absolute -right-8 -top-8 rounded-2xl border border-[#f4d581]/40 bg-black/70 px-3 py-1 text-xs font-semibold text-[#f7d98b] shadow-2xl backdrop-blur-xl"
            >
              {action === "heart" ? "♥" : action === "sparkle" ? "✦✦" : action === "nap" ? "zzz" : action === "meow" ? "Meow!" : "✨"}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </motion.button>
  );
}

function MagneticButton({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  return (
    <motion.button
      ref={ref}
      type="button"
      onMouseMove={(event) => {
        const bounds = ref.current?.getBoundingClientRect();
        if (!bounds) return;
        x.set((event.clientX - bounds.left - bounds.width / 2) * 0.18);
        y.set((event.clientY - bounds.top - bounds.height / 2) * 0.18);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      onClick={onClick}
      style={{ x, y }}
      whileTap={{ scale: 0.96 }}
      className={`group relative overflow-hidden rounded-full px-6 py-3 text-sm font-semibold transition ${className}`}
    >
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition duration-700 group-hover:translate-x-full" />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}

function ProductCard({
  product,
  wished,
  onWishlist,
  onQuickView,
  onCart,
}: {
  product: ProductView;
  wished: boolean;
  onWishlist: () => void;
  onQuickView: () => void;
  onCart: () => void;
}) {
  const discount = productDiscount(product);
  return (
    <motion.article
      layout
      variants={{ hidden: { opacity: 0, y: 34, filter: "blur(10px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)" } }}
      whileHover={{ y: -9 }}
      className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] shadow-[0_24px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#12100d]">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover opacity-88 transition duration-700 group-hover:scale-110 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {product.badge && <span className="rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-[#f7d98b] backdrop-blur-md">{product.badge}</span>}
          {discount > 0 && <span className="rounded-full bg-[#f7d98b] px-3 py-1 text-xs font-black text-black">-{discount}%</span>}
        </div>
        <motion.button
          type="button"
          aria-label="Toggle wishlist"
          onClick={onWishlist}
          whileTap={{ scale: 0.74 }}
          className="absolute right-4 top-4 grid size-11 place-items-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-md"
        >
          <Heart className={`size-5 ${wished ? "fill-[#f7d98b] text-[#f7d98b]" : ""}`} />
        </motion.button>
        <div className="absolute bottom-4 left-4 right-4 flex translate-y-7 gap-2 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <button type="button" onClick={onQuickView} className="flex-1 rounded-full border border-white/15 bg-white/15 py-3 text-xs font-bold text-white backdrop-blur-md">
            Quick view
          </button>
          <button type="button" onClick={onCart} className="flex-1 rounded-full bg-[#f7d98b] py-3 text-xs font-black text-black shadow-[0_0_22px_rgba(247,217,139,0.35)]">
            Add to cart
          </button>
        </div>
      </div>
      <div className="space-y-4 p-5">
        <div>
          <div className="flex items-center gap-1 text-xs text-[#f7d98b]">
            <Star className="size-3 fill-[#f7d98b]" /> {product.rating.toFixed(2)} <span className="text-white/40">({product.reviewCount})</span>
          </div>
          <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">{product.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-white/55">{product.subtitle}</p>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-black text-white">{formatCurrency(product.price, product.currency)}</p>
            {product.compareAtPrice && <p className="text-sm text-white/35 line-through">{formatCurrency(product.compareAtPrice, product.currency)}</p>}
          </div>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/50">{product.inventory} left</span>
        </div>
      </div>
    </motion.article>
  );
}

function QuickViewModal({ product, onClose, onCart }: { product: ProductView | null; onClose: () => void; onCart: (product: ProductView) => void }) {
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => setImageIndex(0), [product?.id]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div className="fixed inset-0 z-[70] grid place-items-center bg-black/72 p-4 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            initial={{ opacity: 0, y: 34, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            className="grid max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d0b09] shadow-[0_40px_120px_rgba(0,0,0,0.65)] lg:grid-cols-[1.05fr_0.95fr]"
          >
            <div className="relative min-h-[420px] overflow-hidden bg-black">
              <img src={product.images[imageIndex]} alt={product.name} className="h-full max-h-[92vh] w-full object-cover" />
              <div className="absolute bottom-4 left-4 flex gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setImageIndex(index)}
                    className={`size-16 overflow-hidden rounded-2xl border ${index === imageIndex ? "border-[#f7d98b]" : "border-white/15"}`}
                  >
                    <img src={image} alt="Product alternate" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-y-auto p-7 lg:p-10">
              <button type="button" onClick={onClose} className="ml-auto grid size-10 place-items-center rounded-full border border-white/10 text-white/70">
                <X className="size-5" />
              </button>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#f7d98b]">Duraiz selection</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white">{product.name}</h2>
              <p className="mt-4 text-lg leading-8 text-white/62">{product.description}</p>
              <div className="mt-6 flex items-center gap-3">
                <span className="text-3xl font-black text-white">{formatCurrency(product.price, product.currency)}</span>
                {product.compareAtPrice && <span className="text-white/35 line-through">{formatCurrency(product.compareAtPrice, product.currency)}</span>}
              </div>
              <dl className="mt-7 grid gap-3 sm:grid-cols-2">
                {Object.entries(product.details).map(([key, value]) => (
                  <div key={key} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <dt className="text-xs uppercase tracking-[0.22em] text-white/35">{key}</dt>
                    <dd className="mt-1 text-sm font-semibold text-white/78">{value}</dd>
                  </div>
                ))}
              </dl>
              <button
                type="button"
                onClick={() => onCart(product)}
                className="mt-8 w-full rounded-full bg-[#f7d98b] px-6 py-4 text-sm font-black text-black shadow-[0_0_35px_rgba(247,217,139,0.35)]"
              >
                Add to cart with concierge packing
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CartDrawer({ open, lines, coupon, setCoupon, onClose, onCheckout }: {
  open: boolean;
  lines: CartLine[];
  coupon: string;
  setCoupon: (value: string) => void;
  onClose: () => void;
  onCheckout: () => void;
}) {
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const discountRate = coupon.toUpperCase() === "DURAIZVIP" ? 0.15 : coupon.toUpperCase() === "CHAMPAGNE10" ? 0.1 : 0;
  const total = subtotal * (1 - discountRate);

  return (
    <AnimatePresence>
      {open && (
        <motion.aside className="fixed inset-y-0 right-0 z-[75] w-full max-w-md border-l border-white/10 bg-[#0b0908]/94 p-6 text-white shadow-2xl backdrop-blur-2xl" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#f7d98b]">Private cart</p>
              <h2 className="mt-1 text-2xl font-semibold">Your Duraiz edit</h2>
            </div>
            <button type="button" onClick={onClose} className="grid size-10 place-items-center rounded-full border border-white/10"><X className="size-5" /></button>
          </div>
          <div className="mt-7 space-y-4">
            {lines.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/15 p-8 text-center text-white/55">Your cart is ready for something exquisite.</div>
            ) : (
              lines.map((line) => (
                <div key={line.product.id} className="flex gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-3">
                  <img src={line.product.images[0]} alt={line.product.name} className="size-20 rounded-2xl object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold">{line.product.name}</p>
                    <p className="mt-1 text-sm text-white/45">Qty {line.quantity} · {formatCurrency(line.product.price)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-7 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
            <label className="text-xs uppercase tracking-[0.25em] text-white/40" htmlFor="coupon">Coupon</label>
            <input id="coupon" value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="CHAMPAGNE10" className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#f7d98b]" />
            {discountRate > 0 && <p className="mt-2 text-sm text-[#f7d98b]">Coupon applied: {Math.round(discountRate * 100)}% private courtesy.</p>}
          </div>
          <div className="mt-7 space-y-3 border-t border-white/10 pt-5 text-sm">
            <div className="flex justify-between text-white/55"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
            <div className="flex justify-between text-white/55"><span>Discount</span><span>-{formatCurrency(subtotal - total)}</span></div>
            <div className="flex justify-between text-xl font-black"><span>Total</span><span>{formatCurrency(total)}</span></div>
          </div>
          <button type="button" onClick={onCheckout} disabled={!lines.length} className="mt-7 w-full rounded-full bg-[#f7d98b] px-5 py-4 text-sm font-black text-black disabled:cursor-not-allowed disabled:opacity-45">
            Continue to secure checkout
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

export function DuraizHome({ products, categories, source }: Props) {
  const shouldReduceMotion = useReducedMotion();
  const [catEnabled, setCatEnabled] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<CartLine[]>([]);
  const [quickView, setQuickView] = useState<ProductView | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [tracking, setTracking] = useState("");

  useEffect(() => {
    if (shouldReduceMotion) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 44, filter: "blur(14px)" },
          { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.05, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 84%" } },
        );
      });
      gsap.to("[data-parallax='slow']", { yPercent: -16, ease: "none", scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 1.2 } });
    });
    return () => ctx.revert();
  }, [shouldReduceMotion]);

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase().trim();
    return products.filter((product) => {
      const categoryMatches = selectedCategory === "all" || product.categoryId === selectedCategory;
      const queryMatches = q
        ? [product.name, product.subtitle, product.description, product.tags.join(" ")].join(" ").toLowerCase().includes(q)
        : true;
      return categoryMatches && queryMatches;
    });
  }, [products, search, selectedCategory]);

  const addToCart = (product: ProductView) => {
    setCart((current) => {
      const existing = current.find((line) => line.product.id === product.id);
      if (existing) return current.map((line) => (line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line));
      return [...current, { product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const toggleWishlist = (id: string) => {
    setWishlist((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const checkout = async () => {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "guest@duraizmart.com",
        couponCode: coupon,
        items: cart.map((line) => ({ productId: line.product.id, name: line.product.name, price: line.product.price, quantity: line.quantity })),
      }),
    });
    const data = (await response.json()) as { trackingCode?: string; checkoutUrl?: string };
    setTracking(data.trackingCode ?? "DM-LUXURY-DEMO");
    if (data.checkoutUrl) window.location.href = data.checkoutUrl;
  };

  const totalItems = cart.reduce((sum, line) => sum + line.quantity, 0);
  const trending = products.filter((product) => product.isTrending).slice(0, 4);
  const flashDeals = products.filter((product) => product.isFlashDeal).slice(0, 3);
  const newArrivals = products.filter((product) => product.isNewArrival).slice(0, 3);
  const recommendations = useMemo(() => {
    const wishedTags = products.filter((product) => wishlist.has(product.id)).flatMap((product) => product.tags);
    return (wishedTags.length ? products.filter((product) => product.tags.some((tag) => wishedTags.includes(tag))) : demoProducts).slice(0, 3);
  }, [products, wishlist]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070605] text-white">
      <CustomCursor />
      <CatCompanion enabled={catEnabled} />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_18%_12%,rgba(247,217,139,0.18),transparent_28%),radial-gradient(circle_at_78%_4%,rgba(255,255,255,0.08),transparent_22%),linear-gradient(135deg,#070605_0%,#120d0a_48%,#050404_100%)]" />
      <div className="pointer-events-none fixed inset-0 z-0 opacity-45 [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:68px_68px]" />
      <div className="particles pointer-events-none fixed inset-0 z-0" />

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/35 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a href="#top" className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-[#f7d98b] to-[#93651d] font-black text-black shadow-[0_0_28px_rgba(247,217,139,0.28)]">DM</span>
            <span>
              <span className="block text-lg font-semibold tracking-[-0.04em]">Duraiz Mart</span>
              <span className="block text-[10px] uppercase tracking-[0.32em] text-[#f7d98b]">Luxury commerce</span>
            </span>
          </a>
          <nav className="hidden items-center gap-8 text-sm text-white/62 lg:flex">
            {navItems.map((item) => (
              <a key={item} href={item === "Admin" ? "/admin" : `#${item.toLowerCase()}`} className="transition hover:text-[#f7d98b]">{item}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setCatEnabled((value) => !value)} className="hidden rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white/65 transition hover:border-[#f7d98b]/40 hover:text-[#f7d98b] sm:block">
              Cat {catEnabled ? "on" : "off"}
            </button>
            <button type="button" onClick={() => setCartOpen(true)} className="relative grid size-11 place-items-center rounded-full border border-white/10 bg-white/[0.04]">
              <ShoppingBag className="size-5" />
              {totalItems > 0 && <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-[#f7d98b] text-[10px] font-black text-black">{totalItems}</span>}
            </button>
            <button type="button" onClick={() => setMenuOpen((value) => !value)} className="grid size-11 place-items-center rounded-full border border-white/10 lg:hidden">
              <Menu className="size-5" />
            </button>
          </div>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden border-t border-white/10 bg-black/80 lg:hidden">
              <div className="grid gap-3 px-6 py-5">
                {navItems.map((item) => <a key={item} href={item === "Admin" ? "/admin" : `#${item.toLowerCase()}`} className="rounded-2xl border border-white/10 px-4 py-3 text-white/70">{item}</a>)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <section id="top" className="relative z-10 min-h-screen px-5 pt-36 lg:px-8">
        <HeroCanvas />
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:min-h-[78vh] lg:grid-cols-[0.95fr_1.05fr]">
          <div data-parallax="slow" className="relative z-10">
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full border border-[#f7d98b]/25 bg-[#f7d98b]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.35em] text-[#f7d98b]">
              <Crown className="size-4" /> Duraiz Mart private launch
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 28, filter: "blur(12px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.08, duration: 0.9 }} className="mt-8 max-w-4xl text-[clamp(4rem,11vw,9.7rem)] font-semibold leading-[0.82] tracking-[-0.085em]">
              Luxury, composed for the modern ritual.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 max-w-2xl text-lg leading-8 text-white/62">
              Enter a cinematic e-commerce maison where black glass, champagne light, curated products, playful intelligence, and concierge-grade shopping meet.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <MagneticButton onClick={() => document.getElementById("collections")?.scrollIntoView({ behavior: "smooth" })} className="bg-[#f7d98b] text-black shadow-[0_0_40px_rgba(247,217,139,0.34)]">
                Explore the collection <ChevronRight className="size-4" />
              </MagneticButton>
              <MagneticButton onClick={() => document.getElementById("deals")?.scrollIntoView({ behavior: "smooth" })} className="border border-white/12 bg-white/[0.06] text-white backdrop-blur-xl">
                View flash deals <Sparkles className="size-4 text-[#f7d98b]" />
              </MagneticButton>
            </motion.div>
          </div>
          <div className="relative hidden lg:block" aria-hidden>
            <div className="absolute right-16 top-12 h-80 w-80 rounded-full bg-[#f7d98b]/20 blur-[90px]" />
          </div>
        </div>
        <div className="mx-auto mt-10 grid max-w-7xl gap-4 pb-16 md:grid-cols-4">
          {[
            ["98%", "Concierge satisfaction"],
            ["24h", "Priority dispatch"],
            ["AI", "Smart recommendations"],
            [source === "database" ? "Live" : "Demo", "PostgreSQL catalog"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
              <p className="text-3xl font-black text-[#f7d98b]">{value}</p>
              <p className="mt-1 text-sm text-white/45">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="collections" className="relative z-10 px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div data-reveal className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#f7d98b]">Featured categories</p>
              <h2 className="mt-4 text-5xl font-semibold tracking-[-0.06em] md:text-7xl">Curated worlds</h2>
            </div>
            <p className="max-w-xl text-white/55">Every category has its own atmosphere, material language, and gift-ready packaging path.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, index) => (
              <motion.button
                data-reveal
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                whileHover={{ y: -8 }}
                className="group relative min-h-80 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 text-left"
              >
                <img src={category.imageUrl} alt={category.name} className="absolute inset-0 h-full w-full object-cover opacity-50 transition duration-700 group-hover:scale-110 group-hover:opacity-70" />
                <div className={`absolute inset-0 bg-gradient-to-t ${category.accent} opacity-20`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="relative flex h-full flex-col justify-between">
                  <span className="grid size-12 place-items-center rounded-2xl border border-white/15 bg-black/35 text-[#f7d98b] backdrop-blur-md">0{index + 1}</span>
                  <span>
                    <h3 className="text-2xl font-semibold tracking-[-0.04em]">{category.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/58">{category.description}</p>
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-2xl md:p-8" data-reveal>
          <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto] lg:items-center">
            <label className="relative block">
              <Search className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-[#f7d98b]" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Live search watches, cashmere, oud, lighting..." className="w-full rounded-full border border-white/10 bg-black/35 py-4 pl-13 pr-5 text-white outline-none transition placeholder:text-white/35 focus:border-[#f7d98b]/50" />
            </label>
            <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} className="rounded-full border border-white/10 bg-black/70 px-5 py-4 text-white outline-none focus:border-[#f7d98b]/50">
              <option value="all">All categories</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
            <div className="flex items-center gap-2 rounded-full border border-white/10 px-5 py-4 text-sm text-white/55">
              <Settings2 className="size-4 text-[#f7d98b]" /> Smart filters active
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div data-reveal className="flex items-end justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#f7d98b]">Trending products</p>
              <h2 className="mt-4 text-5xl font-semibold tracking-[-0.06em] md:text-7xl">Desired now</h2>
            </div>
            <span className="hidden rounded-full border border-white/10 px-4 py-2 text-sm text-white/45 md:block">{filteredProducts.length} results</span>
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} transition={{ staggerChildren: 0.08 }} className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {(search || selectedCategory !== "all" ? filteredProducts : trending).map((product) => (
              <ProductCard key={product.id} product={product} wished={wishlist.has(product.id)} onWishlist={() => toggleWishlist(product.id)} onQuickView={() => setQuickView(product)} onCart={() => addToCart(product)} />
            ))}
          </motion.div>
          {filteredProducts.length === 0 && <div className="mt-10 rounded-[2rem] border border-dashed border-white/15 p-10 text-center text-white/55">No exact match yet. Our AI concierge recommends broadening the search.</div>}
        </div>
      </section>

      <section id="deals" className="relative z-10 px-5 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div data-reveal className="rounded-[2.5rem] border border-[#f7d98b]/20 bg-[#f7d98b]/10 p-8 backdrop-blur-xl">
            <p className="text-xs font-black uppercase tracking-[0.35em] text-[#f7d98b]">Flash deals</p>
            <h2 className="mt-4 text-5xl font-semibold tracking-[-0.06em]">Champagne-hour privileges.</h2>
            <p className="mt-5 text-white/58">Limited markdowns, soft-glow badges, and coupon intelligence. Try CHAMPAGNE10 or DURAIZVIP in cart.</p>
            <div className="mt-8 grid grid-cols-3 gap-3 text-center">
              {[["04", "Hours"], ["18", "Minutes"], ["52", "Seconds"]].map(([value, label]) => <div key={label} className="rounded-3xl bg-black/35 p-4"><p className="text-3xl font-black text-[#f7d98b]">{value}</p><p className="text-xs text-white/45">{label}</p></div>)}
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {flashDeals.map((product) => (
              <motion.button data-reveal whileHover={{ y: -8 }} key={product.id} type="button" onClick={() => setQuickView(product)} className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] text-left">
                <img src={product.images[0]} alt={product.name} className="aspect-[4/4.3] w-full object-cover" />
                <div className="p-5"><p className="text-sm text-[#f7d98b]">-{productDiscount(product)}% today</p><h3 className="mt-2 font-semibold">{product.name}</h3><p className="mt-2 text-xl font-black">{formatCurrency(product.price)}</p></div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-3">
            <div data-reveal className="lg:col-span-1">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#f7d98b]">New arrivals</p>
              <h2 className="mt-4 text-5xl font-semibold tracking-[-0.06em]">Fresh from the private room.</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3 lg:col-span-2">
              {newArrivals.map((product) => (
                <div data-reveal key={product.id} className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
                  <img src={product.images[0]} alt={product.name} className="aspect-square rounded-[1.5rem] object-cover" />
                  <p className="mt-4 text-xs uppercase tracking-[0.25em] text-[#f7d98b]">New arrival</p>
                  <h3 className="mt-2 text-xl font-semibold">{product.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="concierge" className="relative z-10 px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2.8rem] border border-white/10 bg-gradient-to-br from-white/[0.075] to-white/[0.025] p-6 backdrop-blur-2xl md:p-10" data-reveal>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#f7d98b]">AI recommendations</p>
              <h2 className="mt-4 text-5xl font-semibold tracking-[-0.06em]">A smarter luxury edit.</h2>
              <p className="mt-5 text-white/58">The recommendation engine responds to wishlist signals, recently viewed products, and aesthetic affinity. This demo adapts instantly to your wishlist.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  [WandSparkles, "Intent-aware recommendations"],
                  [ShieldCheck, "Secure checkout posture"],
                  [Truck, "Order tracking workflow"],
                  [PackageCheck, "Saved items and wishlists"],
                ].map(([Icon, label]) => {
                  const TypedIcon = Icon as typeof WandSparkles;
                  return <div key={label as string} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4"><TypedIcon className="size-5 text-[#f7d98b]" /><span className="text-sm text-white/70">{label as string}</span></div>;
                })}
              </div>
            </div>
            <div className="grid gap-4">
              {recommendations.map((product) => (
                <button key={product.id} type="button" onClick={() => setQuickView(product)} className="flex items-center gap-4 rounded-[1.8rem] border border-white/10 bg-black/25 p-3 text-left transition hover:border-[#f7d98b]/35">
                  <img src={product.images[0]} alt={product.name} className="size-24 rounded-3xl object-cover" />
                  <span className="flex-1"><span className="block font-semibold">{product.name}</span><span className="mt-1 block text-sm text-white/45">Recommended by your current taste profile</span></span>
                  <ChevronRight className="size-5 text-[#f7d98b]" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div data-reveal className="text-center"><p className="text-xs font-bold uppercase tracking-[0.35em] text-[#f7d98b]">Testimonials</p><h2 className="mt-4 text-5xl font-semibold tracking-[-0.06em]">Quietly adored.</h2></div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div data-reveal key={testimonial.name} className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 backdrop-blur-xl">
                <div className="flex text-[#f7d98b]">{Array.from({ length: 5 }, (_, index) => <Star key={index} className="size-4 fill-current" />)}</div>
                <p className="mt-5 text-lg leading-8 text-white/72">“{testimonial.quote}”</p>
                <p className="mt-6 font-semibold">{testimonial.name}</p>
                <p className="text-sm text-white/42">{testimonial.role} · {testimonial.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-5 py-20 lg:px-8">
        <div data-reveal className="mx-auto grid max-w-7xl gap-6 rounded-[2.8rem] border border-[#f7d98b]/20 bg-[#f7d98b]/10 p-8 backdrop-blur-xl lg:grid-cols-[1fr_0.8fr] lg:p-12">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-[#f7d98b]">Newsletter</p>
            <h2 className="mt-4 text-5xl font-semibold tracking-[-0.06em]">Join the black-card dispatch.</h2>
            <p className="mt-5 text-white/58">Receive private drops, editorial shopping guides, and early access to rare Duraiz Mart edits.</p>
          </div>
          <form className="flex flex-col justify-center gap-3 sm:flex-row" onSubmit={(event) => event.preventDefault()}>
            <input aria-label="Email address" type="email" placeholder="you@example.com" className="min-w-0 flex-1 rounded-full border border-white/10 bg-black/35 px-5 py-4 text-white outline-none placeholder:text-white/35 focus:border-[#f7d98b]/50" />
            <button className="rounded-full bg-[#f7d98b] px-7 py-4 text-sm font-black text-black" type="submit">Request access</button>
          </form>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 px-5 py-12 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4">
          <div className="md:col-span-2"><p className="text-2xl font-semibold tracking-[-0.04em]">Duraiz Mart</p><p className="mt-3 max-w-md text-sm leading-6 text-white/45">An original ultra-premium commerce concept for modern luxury shopping, built with Next.js, Drizzle, PostgreSQL, motion systems, and cinematic interaction design.</p></div>
          {["Shop", "Account"].map((group) => <div key={group}><p className="font-semibold text-[#f7d98b]">{group}</p><div className="mt-3 grid gap-2 text-sm text-white/45"><a href="/shop">Live search</a><a href="/account">Profile</a><a href="/admin">Admin dashboard</a></div></div>)}
        </div>
      </footer>

      {tracking && <div className="fixed bottom-5 left-1/2 z-[82] -translate-x-1/2 rounded-full border border-[#f7d98b]/30 bg-black/75 px-5 py-3 text-sm text-[#f7d98b] shadow-2xl backdrop-blur-xl">Order created · Tracking {tracking}</div>}
      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} onCart={addToCart} />
      <CartDrawer open={cartOpen} lines={cart} coupon={coupon} setCoupon={setCoupon} onClose={() => setCartOpen(false)} onCheckout={checkout} />
    </main>
  );
}
