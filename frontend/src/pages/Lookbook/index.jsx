import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { scrollFadeUp, scrollSlideLeft, scrollSlideRight, staggerContainer, fadeUpItem } from "../../animations/variants";
import { lookbookService } from "../../services/lookbook.service";
import { productService } from "../../services/product.service";
import { getImageUrl } from "../../utils/getImageUrl";
import { formatCurrency } from "../../utils/formatCurrency";
import ProductTile from "../Shop/components/ProductTile";

const PLACEHOLDERS = [
  "https://placehold.co/1000x1250/e4e2e1/5c5b5b?text=4:5+PORTRAIT+MODEL",
  "https://placehold.co/1600x900/e4e2e1/5c5b5b?text=16:9+NIGHT+RIDE",
  "https://placehold.co/800x1000/e4e2e1/5c5b5b?text=4:5+GOLDEN+HOUR",
  "https://placehold.co/800x1000/e4e2e1/5c5b5b?text=4:5+CONCRETE",
  "https://placehold.co/900x1200/e4e2e1/5c5b5b?text=3:4+TALL+WORKSHOP",
  "https://placehold.co/1600x900/e4e2e1/5c5b5b?text=16:9+OFF-DUTY",
  "https://placehold.co/1600x900/e4e2e1/5c5b5b?text=16:9+RIDE+OUT",
];

const DEFAULT_TITLES = ["", "NIGHT RIDE", "GOLDEN HOUR", "CONCRETE", "WORKSHOP", "OFF-DUTY", "RIDE OUT"];

// Strip sản phẩm "Shop This Look" hiển thị dưới mỗi story
function ShopThisLookStrip({ products }) {
  if (!products?.length) return null;
  return (
    <div className="mt-4">
      <div className="mb-3 flex items-center gap-3">
        <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#004be3]">
          // SHOP THIS LOOK
        </span>
        <div className="h-px flex-1 bg-black/10" />
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {products.map((p) => (
          <Link
            key={p._id}
            to={`/product/${p.slug}`}
            className="group flex shrink-0 flex-col gap-2 w-28"
          >
            <div className="relative overflow-hidden rounded-xl bg-[#f3f0ef] aspect-square w-28">
              <img
                src={getImageUrl(p.images?.[0] || "")}
                alt={p.name}
                onError={(e) => { e.currentTarget.src = "https://placehold.co/112x112/e4e2e1/5c5b5b?text=?"; }}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
              {(p.totalStock ?? 0) === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <span className="rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#2f2f2e]">
                    Hết
                  </span>
                </div>
              )}
            </div>
            <div>
              <p className="line-clamp-2 text-[11px] font-semibold leading-tight text-[#2f2f2e] group-hover:text-[#004be3] transition">
                {p.name}
              </p>
              <p className="mt-0.5 text-[11px] font-bold text-[#004be3]">
                {formatCurrency(p.price)}
              </p>
            </div>
          </Link>
        ))}
        <Link
          to="/shop"
          className="flex shrink-0 w-20 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-black/15 text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] transition hover:border-[#004be3] hover:text-[#004be3]"
        >
          <span className="text-lg">→</span>
          <span>Tất cả</span>
        </Link>
      </div>
    </div>
  );
}

export default function Lookbook() {
  const [stories, setStories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let cancelled = false;

    lookbookService
      .getStories()
      .then((res) => {
        if (!cancelled) setStories(res.data?.data ?? []);
      })
      .catch(() => {});

    productService
      .list({ limit: 4, isFeatured: true })
      .then((res) => {
        if (!cancelled && res.data) setProducts(res.data.products);
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, []);

  const storyMap = {};
  stories.forEach((s) => { storyMap[s.order] = s; });

  const img = (index) => storyMap[index]?.imageUrl || PLACEHOLDERS[index] || "";
  const title = (index) => storyMap[index]?.title || DEFAULT_TITLES[index] || "";
  const subtitle = (index) => storyMap[index]?.subtitle || "";
  const storyProducts = (index) => storyMap[index]?.products ?? [];

  const formattedProducts = products.map((p) => ({
    _id: p._id,
    id: p.slug,
    title: p.name,
    categoryLabel: p.category?.name || "CLOTHING",
    price: p.price,
    image: getImageUrl(p.images?.[0] || ""),
    isOutOfStock: (p.totalStock ?? 0) === 0,
    badge: p.isFeatured ? { text: "HOT", tone: "brand" } : null,
  }));

  return (
    <div className="bg-[#f9f6f5] min-h-screen text-[#2f2f2e]">
      {/* 1. Header Section */}
      <section className="mx-auto w-full max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-start">
          <motion.div {...scrollSlideLeft} className="flex flex-col">
            <p className="text-xs font-bold uppercase tracking-widest text-[#5c5b5b] mb-4">
              LOOKBOOK VOL. 02 — WINTER/24
            </p>
            <h1 className="font-heading text-6xl font-extrabold uppercase leading-[0.85] tracking-tight text-[#2f2f2e] sm:text-8xl md:text-[140px] mb-12">
              URBAN
              <br />
              CHRONI-
              <br />
              CLES.
            </h1>
            <div className="grid grid-cols-4 gap-4 border-t border-black/10 pt-6 mt-auto">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#5c5b5b] mb-1">SHOT BY</p>
                <p className="text-xs font-bold text-[#2f2f2e]">Linh Nguyen</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#5c5b5b] mb-1">STYLED</p>
                <p className="text-xs font-bold text-[#2f2f2e]">Tùng Phạm</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#5c5b5b] mb-1">ITEMS</p>
                <p className="text-xs font-bold text-[#2f2f2e]">28 accessories</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#5c5b5b] mb-1">STORIES</p>
                <p className="text-xs font-bold text-[#2f2f2e]">
                  {String(Math.max(stories.length, 4)).padStart(2, "0")}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div {...scrollSlideRight} className="flex flex-col gap-4 lg:pl-12">
            <img
              src={img(0)}
              alt={title(0) || "Featured Model"}
              className="w-full aspect-[4/5] object-cover bg-[#e4e2e1] rounded-3xl"
            />
            {subtitle(0) && (
              <p className="text-xs italic text-[#5c5b5b]">{subtitle(0)}</p>
            )}
            <ShopThisLookStrip products={storyProducts(0)} />
          </motion.div>
        </div>
      </section>

      {/* 2. Marquee Section */}
      <section className="w-full overflow-hidden bg-[#004be3] py-4">
        <style>{`
          @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          .animate-marquee-custom { animation: marquee 20s linear infinite; }
        `}</style>
        <div className="flex whitespace-nowrap animate-marquee-custom w-[200%]">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-8 px-4 text-sm font-bold uppercase tracking-widest text-white w-1/4 justify-around"
            >
              <span>● SHOP THE LOOK ➔</span>
              <span>THE STORIES</span>
              <span>● {String(Math.max(stories.length, 4)).padStart(2, "0")} ITEMS ●</span>
              <span>MORE FROM URBAN CHRONICLES...</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Bento Box Gallery */}
      <section className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
        <motion.div {...scrollFadeUp} className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 md:gap-8">
          {/* Left Column */}
          <div className="flex flex-col gap-4 md:gap-8">
            <div className="flex flex-col gap-3">
              <img
                src={img(1)}
                alt={title(1)}
                className="w-full aspect-video object-cover bg-[#e4e2e1] rounded-3xl"
              />
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-end px-2">
                <h2 className="m-0 font-heading text-4xl font-extrabold uppercase leading-none tracking-tight text-[#2f2f2e] sm:text-6xl md:text-7xl">
                  {title(1)}
                </h2>
                {subtitle(1) && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#5c5b5b] mb-2 hidden sm:block">
                    {subtitle(1)}
                  </span>
                )}
              </div>
              <ShopThisLookStrip products={storyProducts(1)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
              <div className="flex flex-col gap-3">
                <img
                  src={img(2)}
                  alt={title(2)}
                  className="w-full aspect-[4/5] object-cover bg-[#e4e2e1] rounded-3xl"
                />
                <h3 className="m-0 font-heading text-2xl font-bold uppercase leading-none text-[#2f2f2e] sm:text-3xl px-2 mt-1">
                  {title(2)}
                </h3>
                <ShopThisLookStrip products={storyProducts(2)} />
              </div>
              <div className="flex flex-col gap-3">
                <img
                  src={img(3)}
                  alt={title(3)}
                  className="w-full aspect-[4/5] object-cover bg-[#e4e2e1] rounded-3xl"
                />
                <h3 className="m-0 font-heading text-2xl font-bold uppercase leading-none text-[#2f2f2e] sm:text-3xl px-2 mt-1">
                  {title(3)}
                </h3>
                <ShopThisLookStrip products={storyProducts(3)} />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4 md:gap-8 mt-8 lg:mt-0">
            <img
              src={img(4)}
              alt={title(4)}
              className="w-full aspect-[8/4] object-cover bg-[#e4e2e1] rounded-3xl h-full max-h-[800px] lg:max-h-none"
            />
            <div className="px-2">
              {subtitle(4) && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#5c5b5b]">
                  {subtitle(4)}
                </span>
              )}
              <h2 className="mt-2 m-0 font-heading text-4xl font-extrabold uppercase leading-none tracking-tight text-[#2f2f2e] sm:text-6xl">
                {title(4)}
              </h2>
              <ShopThisLookStrip products={storyProducts(4)} />
              {!storyProducts(4).length && (
                <Link
                  to="/shop"
                  className="mt-4 inline-block bg-[#004be3] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:brightness-110 rounded-full"
                >
                  SHOP THE LOOK <span className="ml-2">→</span>
                </Link>
              )}
            </div>
          </div>
        </motion.div>

        {/* Second Row */}
        <motion.div
          {...scrollFadeUp}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-12 md:mt-16"
        >
          <div className="flex flex-col gap-3">
            <img
              src={img(5)}
              alt={title(5)}
              className="w-full aspect-video object-cover bg-[#e4e2e1] rounded-3xl"
            />
            <h3 className="m-0 font-heading text-2xl font-bold uppercase leading-none text-[#2f2f2e] sm:text-3xl px-2 mt-1">
              {title(5)}
            </h3>
            <ShopThisLookStrip products={storyProducts(5)} />
          </div>
          <div className="flex flex-col gap-3">
            <img
              src={img(6)}
              alt={title(6)}
              className="w-full aspect-video object-cover bg-[#e4e2e1] rounded-3xl"
            />
            <h3 className="m-0 font-heading text-2xl font-bold uppercase leading-none text-[#2f2f2e] sm:text-3xl px-2 mt-1">
              {title(6)}
            </h3>
            <ShopThisLookStrip products={storyProducts(6)} />
          </div>
        </motion.div>
      </section>

      {/* 4. Shop The Look Section */}
      <section className="mx-auto w-full max-w-[1440px] px-4 pb-20 sm:px-6 lg:px-8">
        <motion.div {...scrollFadeUp} className="mb-8 flex items-center justify-between border-t border-black/10 pt-12">
          <h2 className="m-0 font-heading text-4xl font-extrabold uppercase tracking-tight text-[#2f2f2e] sm:text-5xl">
            SHOP THE LOOK
          </h2>
          <Link
            to="/shop"
            className="hidden sm:inline-block bg-[#2f2f2e] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:brightness-110 rounded-full"
          >
            TẤT CẢ SẢN PHẨM <span className="ml-2">→</span>
          </Link>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-2 gap-4 md:gap-6 xl:grid-cols-4"
        >
          {formattedProducts.map((product) => (
            <motion.div key={product._id} variants={fadeUpItem}>
              <ProductTile product={product} className="col-span-1" />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/shop"
            className="inline-block bg-[#2f2f2e] px-8 py-4 text-xs font-bold uppercase tracking-widest text-white transition hover:brightness-110 w-full rounded-full"
          >
            TẤT CẢ SẢN PHẨM <span className="ml-2">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
