export default function EditorialGrid() {
  const cards = [
    {
      title: "Look 01",
      description: "Áo khoác nhẹ, form rộng, tinh gọn.",
    },
    {
      title: "Look 02",
      description: "Layering đơn giản với nhịp màu trung tính.",
    },
    {
      title: "Look 03",
      description: "Phụ kiện và chi tiết tạo điểm nhấn.",
    },
  ];

  return (
    <section className="grid gap-4 py-10 md:grid-cols-3">
      {cards.map((card) => (
        <article
          key={card.title}
          className="rounded-2xl bg-white p-6 shadow-sm"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#004be3]">
            {card.title}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#5c5b5b]">
            {card.description}
          </p>
        </article>
      ))}
    </section>
  );
}
