export default function MarqueeSection() {
  return (
    <section className="bg-[#004be3] px-4 py-7 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-400 overflow-hidden rounded-4xl bg-[#004be3] py-2.5 text-white sm:py-3">
        <div className="animate-[marquee_20s_linear_infinite] whitespace-nowrap font-heading text-[1.9rem] font-extrabold uppercase tracking-[-0.04em] sm:text-5xl">
          VIBE URBAN / 24 DROP AVAILABLE NOW / VIBE URBAN / 24 DROP AVAILABLE
          NOW /
        </div>
      </div>
    </section>
  );
}
