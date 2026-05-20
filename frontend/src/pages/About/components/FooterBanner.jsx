export default function FooterBanner() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-20 sm:px-6 lg:px-8 border-t border-black/10 text-center">
      <h2 className="font-heading text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.9] text-[#0f172a] mb-6">
        Đi giữa <span className="italic font-serif lowercase">nắng,</span><br />
        đi cùng <span className="italic font-serif lowercase">nhịp.</span>
      </h2>
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">
        // SOLAR. © 2026 • HCM • HN • ĐN • HP
      </p>
    </section>
  );
}
