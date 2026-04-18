import FilterSidebar from "./components/FilterSidebar";

export default function Shop() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
      <h1 className="text-3xl font-extrabold uppercase tracking-[-0.04em] text-[#2f2f2e]">
        Shop
      </h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <FilterSidebar />
        <div className="rounded-3xl border border-dashed border-black/10 bg-white p-6 text-[#5c5b5b]">
          Danh sách sản phẩm đang được phát triển.
        </div>
      </div>
    </section>
  );
}
