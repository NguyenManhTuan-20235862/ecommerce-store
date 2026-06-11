import { motion } from "framer-motion";
import { Link } from "react-router";
import { CATEGORY_CONFIGS } from "./categoryConfigs";

export default function CategoryHeroPanel({ categorySlug, total }) {
  const config = CATEGORY_CONFIGS[categorySlug];
  if (!config) return null;

  return (
    <motion.div
      key={categorySlug}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative mb-10 overflow-hidden rounded-2xl bg-[#0f172a]"
    >
      {/* Top accent stripe */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#004be3] via-[#819bff] to-transparent" />

      {/* Giant background character */}
      <div
        className="pointer-events-none absolute -right-6 -top-6 select-none font-heading font-extrabold uppercase leading-none text-white/[0.03]"
        style={{ fontSize: "clamp(160px, 28vw, 380px)" }}
        aria-hidden="true"
      >
        {config.accentChar}
      </div>

      {/* Dot grid decoration */}
      <div
        className="pointer-events-none absolute bottom-8 left-8 hidden grid-cols-8 gap-[10px] opacity-10 lg:grid"
        aria-hidden="true"
      >
        {Array.from({ length: 32 }).map((_, i) => (
          <div key={i} className="h-[3px] w-[3px] rounded-full bg-white" />
        ))}
      </div>

      <div className="relative grid grid-cols-1 gap-8 px-8 py-12 md:px-12 md:py-14 lg:grid-cols-[1fr_1fr] lg:gap-0">
        {/* Left: category identity */}
        <div className="flex flex-col justify-between gap-10 lg:border-r lg:border-white/10 lg:pr-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-white/25">
            <Link to="/shop" className="transition hover:text-white/60">
              Shop
            </Link>
            <span>/</span>
            <span className="text-white/50">{config.title}</span>
          </nav>

          {/* Giant title */}
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.35em] text-[#819bff]">
              {config.subtitle}
            </p>
            <h1
              className="font-heading font-extrabold uppercase leading-[0.85] tracking-tight text-white"
              style={{ fontSize: "clamp(56px, 8vw, 140px)" }}
            >
              {config.title}
            </h1>
          </div>
        </div>

        {/* Right: description + stats */}
        <div className="flex flex-col justify-between lg:pl-12 lg:pt-16">
          <p className="text-sm leading-relaxed text-white/40 lg:max-w-[280px]">
            {config.description}
          </p>

          <div className="mt-8 flex items-end justify-between border-t border-white/10 pt-5 lg:mt-0">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
              // VIBE URBAN
            </span>
            {total > 0 ? (
              <span className="font-heading text-4xl font-extrabold text-white">
                {total}
                <span className="ml-1.5 text-[10px] font-normal tracking-[0.2em] text-white/30">
                  SẢN PHẨM
                </span>
              </span>
            ) : (
              <span className="font-heading text-4xl font-extrabold text-white/20">—</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
