import { useEffect, useState } from "react";
import { Link } from "react-router";
import ProductTile from "../Shop/components/ProductTile";
import { lookbookService } from "../../services/lookbook.service";
import { productService } from "../../services/product.service";
import { getImageUrl } from "../../utils/getImageUrl";

// Placeholder khi story chưa có ảnh, giữ nguyên text cũ
const PLACEHOLDERS = [
  "https://placehold.co/1000x1250/f3f0ef/94a3b8?text=4:5+PORTRAIT+MODEL",
  "https://placehold.co/1600x900/f3f0ef/94a3b8?text=16:9+NIGHT+RIDE",
  "https://placehold.co/800x1000/f3f0ef/94a3b8?text=4:5+GOLDEN+HOUR",
  "https://placehold.co/800x1000/f3f0ef/94a3b8?text=4:5+CONCRETE",
  "https://placehold.co/900x1200/f3f0ef/94a3b8?text=3:4+TALL+WORKSHOP",
  "https://placehold.co/1600x900/f3f0ef/94a3b8?text=16:9+OFF-DUTY",
  "https://placehold.co/1600x900/f3f0ef/94a3b8?text=16:9+RIDE+OUT",
];

const DEFAULT_TITLES = [
  "", "NIGHT RIDE", "GOLDEN HOUR", "CONCRETE", "WORKSHOP", "OFF-DUTY", "RIDE OUT",
];

export default function Lookbook() {
  const [stories, setStories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let cancelled = false;

    lookbookService.getStories()
      .then((res) => {
        if (!cancelled) setStories(res.data?.data ?? []);
      })
      .catch(() => {});

    productService.list({ limit: 4, isFeatured: true })
      .then((res) => {
        if (!cancelled && res.data) setProducts(res.data.products);
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, []);

  // Map story theo order value trực tiếp → story order=1 luôn vào slot 1
  const storyMap = {};
  stories.forEach((s) => { storyMap[s.order] = s; });

  const img = (index) => storyMap[index]?.imageUrl || PLACEHOLDERS[index] || "";
  const title = (index) => storyMap[index]?.title || DEFAULT_TITLES[index] || "";
  const subtitle = (index) => storyMap[index]?.subtitle || "";

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
    <div className="bg-[#f9f6f5] min-h-screen text-[#0f172a]">
      {/* 1. Header Section */}
      <section className="mx-auto w-full max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-start">
          <div className="flex flex-col">
            <p className="text-xs font-bold uppercase tracking-widest text-[#94a3b8] mb-4">
              LOOKBOOK VOL. 02 — WINTER/24
            </p>
            <h1 className="font-heading text-6xl font-extrabold uppercase leading-[0.85] tracking-tight text-[#0f172a] sm:text-8xl md:text-[140px] mb-12">
              URBAN<br />CHRONI-<br />CLES.
            </h1>
            <div className="grid grid-cols-4 gap-4 border-t border-black/10 pt-6 mt-auto">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-1">SHOT BY</p>
                <p className="text-xs font-bold text-[#0f172a]">Linh Nguyen</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-1">STYLED</p>
                <p className="text-xs font-bold text-[#0f172a]">Tùng Phạm</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-1">ITEMS</p>
                <p className="text-xs font-bold text-[#0f172a]">28 accessories</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-1">STORIES</p>
                <p className="text-xs font-bold text-[#0f172a]">{String(Math.max(stories.length, 4)).padStart(2, "0")}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:pl-12">
            <img
              src={img(0)}
              alt={title(0) || "Featured Model"}
              className="w-full aspect-[4/5] object-cover bg-[#f3f0ef] rounded-3xl"
            />
            {subtitle(0) && (
              <p className="text-xs italic text-[#334155]">{subtitle(0)}</p>
            )}
          </div>
        </div>
      </section>

      {/* 2. Marquee Section */}
      <section className="w-full overflow-hidden bg-[#004be3] py-4 border-y border-black/10">
        <style>{`
          @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          .animate-marquee-custom { animation: marquee 20s linear infinite; }
        `}</style>
        <div className="flex whitespace-nowrap animate-marquee-custom w-[200%]">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 px-4 text-sm font-bold uppercase tracking-widest text-white w-1/4 justify-around">
              <span>● MARQUEE ➔</span>
              <span>THE STORIES</span>
              <span>● {String(Math.max(stories.length, 4)).padStart(2, "0")} ITEMS ●</span>
              <span>MORE FROM URBAN CHRONICLES...</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Bento Box Gallery */}
      <section className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 md:gap-8">

          {/* Left Column */}
          <div className="flex flex-col gap-4 md:gap-8">
            <div className="flex flex-col gap-3">
              <img
                src={img(1)}
                alt={title(1)}
                className="w-full aspect-video object-cover bg-[#f3f0ef] rounded-3xl"
              />
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-end px-2">
                <h2 className="m-0 font-heading text-4xl font-extrabold uppercase leading-none tracking-tight text-[#0f172a] sm:text-6xl md:text-7xl">
                  {title(1)}
                </h2>
                {subtitle(1) && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-2 hidden sm:block">
                    {subtitle(1)}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
              <div className="flex flex-col gap-3">
                <img
                  src={img(2)}
                  alt={title(2)}
                  className="w-full aspect-[4/5] object-cover bg-[#f3f0ef] rounded-3xl"
                />
                <h3 className="m-0 font-heading text-2xl font-bold uppercase leading-none text-[#0f172a] sm:text-3xl px-2 mt-1">
                  {title(2)}
                </h3>
              </div>
              <div className="flex flex-col gap-3">
                <img
                  src={img(3)}
                  alt={title(3)}
                  className="w-full aspect-[4/5] object-cover bg-[#f3f0ef] rounded-3xl"
                />
                <h3 className="m-0 font-heading text-2xl font-bold uppercase leading-none text-[#0f172a] sm:text-3xl px-2 mt-1">
                  {title(3)}
                </h3>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4 md:gap-8 mt-8 lg:mt-0">
            <img
              src={img(4)}
              alt={title(4)}
              className="w-full aspect-[8/4] object-cover bg-[#f3f0ef] rounded-3xl h-full max-h-[800px] lg:max-h-none"
            />
            <div className="px-2">
              {subtitle(4) && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">
                  {subtitle(4)}
                </span>
              )}
              <h2 className="mt-2 m-0 font-heading text-4xl font-extrabold uppercase leading-none tracking-tight text-[#0f172a] sm:text-6xl">
                {title(4)}
              </h2>
              <Link
                to="/shop"
                className="mt-4 inline-block bg-[#004be3] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-blue-700"
              >
                SHOP THE LOOK <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-12 md:mt-16">
          <div className="flex flex-col gap-3">
            <img
              src={img(5)}
              alt={title(5)}
              className="w-full aspect-video object-cover bg-[#f3f0ef] rounded-3xl"
            />
            <h3 className="m-0 font-heading text-2xl font-bold uppercase leading-none text-[#0f172a] sm:text-3xl px-2 mt-1">
              {title(5)}
            </h3>
          </div>
          <div className="flex flex-col gap-3">
            <img
              src={img(6)}
              alt={title(6)}
              className="w-full aspect-video object-cover bg-[#f3f0ef] rounded-3xl"
            />
            <h3 className="m-0 font-heading text-2xl font-bold uppercase leading-none text-[#0f172a] sm:text-3xl px-2 mt-1">
              {title(6)}
            </h3>
          </div>
        </div>
      </section>

      {/* 4. Shop The Look Section */}
      <section className="mx-auto w-full max-w-[1440px] px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between border-t border-black/10 pt-12">
          <h2 className="m-0 font-heading text-4xl font-extrabold uppercase tracking-tight text-[#0f172a] sm:text-5xl">
            SHOP THE LOOK
          </h2>
          <Link
            to="/shop"
            className="hidden sm:inline-block bg-[#0f172a] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-black"
          >
            TẤT CẢ SẢN PHẨM <span className="ml-2">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-6 xl:grid-cols-4">
          {formattedProducts.map((product) => (
            <ProductTile key={product._id} product={product} className="col-span-1" />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/shop"
            className="inline-block bg-[#0f172a] px-8 py-4 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-black w-full"
          >
            TẤT CẢ SẢN PHẨM <span className="ml-2">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
