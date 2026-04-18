export default function FilterSidebar() {
  const sections = ["Danh mục", "Kích thước", "Màu sắc", "Khoảng giá"];

  return (
    <aside className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-[#2f2f2e]">
        Bộ lọc
      </h2>
      <div className="mt-4 space-y-4 text-sm text-[#5c5b5b]">
        {sections.map((item) => (
          <div key={item} className="rounded-2xl bg-[#f3f0ef] p-4">
            {item}
          </div>
        ))}
      </div>
    </aside>
  );
}
