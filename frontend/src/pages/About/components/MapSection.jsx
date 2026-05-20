import { useState } from "react";

const stores = [
  {
    key: "SG",
    label: "Sài Gòn",
    storeNo: "01",
    name: "solar. Saigon Flagship",
    address: "28 Tôn Đản, Q.04, TP. HCM",
    time: "09:30 – 22:00",
    phone: "028 73 071 175",
    rating: 4.9,
    reviews: 128,
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.8168792988846!2d106.69849807486714!3d10.754248789380264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f37e84de1ed%3A0x3765bdb8d282f6b5!2zVMO0biBE4bqnbiwgUXXhuq1uIDQsIFRow6BuaCBwaOG7kSBI8buTIENow60gTWluaA!5e0!3m2!1svi!2s!4v1715000000000!5m2!1svi!2s",
    mapsUrl: "https://maps.google.com/?q=28+T%C3%B4n+%C4%90%E1%BA%A3n+Q.04+TP.HCM",
    dotColor: "bg-[#ff6b35]",
    tagColor: "bg-[#ff6b35] text-white",
  },
  {
    key: "HN",
    label: "Hà Nội",
    storeNo: "02",
    name: "solar. Hanoi Centre",
    address: "B2-34, Tầng B2, 175 Nguyễn Thái Học, Đống Đa, Hà Nội",
    time: "10:00 – 22:00",
    phone: "024 73 071 175",
    rating: 4.8,
    reviews: 97,
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.6548498714574!2d105.83469477499693!3d21.02898128062002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab953357c995%3A0x1babf5abb5a2e1bc!2s175%20P.%20Nguy%E1%BB%85n%20Th%C3%A1i%20H%E1%BB%8Dc%2C%20%C3%94%20Ch%E1%BB%A3%20D%E1%BB%ABa%2C%20%C4%90%E1%BB%91ng%20%C4%90a%2C%20H%C3%A0%20N%E1%BB%99i!5e0!3m2!1svi!2s!4v1715000000001!5m2!1svi!2s",
    mapsUrl: "https://maps.google.com/?q=175+Nguy%E1%BB%85n+Th%C3%A1i+H%E1%BB%8Dc+%C4%90%E1%BB%91ng+%C4%90a+H%C3%A0+N%E1%BB%99i",
    dotColor: "bg-[#004be3]",
    tagColor: "bg-[#004be3] text-white",
  },
  {
    key: "ĐN",
    label: "Đà Nẵng",
    storeNo: "03",
    name: "solar. Da Nang Beach",
    address: "218 Võ Nguyên Giáp, Phước Mỹ, Sơn Trà, Đà Nẵng",
    time: "09:00 – 22:30",
    phone: "0236 73 071 175",
    rating: 4.9,
    reviews: 62,
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.028027540706!2d108.24284727492957!3d16.05932238462289!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314218e2c04e47a3%3A0x4aae1cbfbbf6baad!2sV%C3%B5%20Nguy%C3%AAn%20Gi%C3%A1p%2C%20Ph%C6%B0%E1%BB%9Bc%20M%E1%BB%B9%2C%20S%C6%A1n%20Tr%C3%A0%2C%20%C4%90%C3%A0%20N%E1%BA%B5ng!5e0!3m2!1svi!2s!4v1715000000002!5m2!1svi!2s",
    mapsUrl: "https://maps.google.com/?q=218+V%C3%B5+Nguy%C3%AAn+Gi%C3%A1p+%C4%90%C3%A0+N%E1%BA%B5ng",
    dotColor: "bg-[#c8e6c9]",
    tagColor: "bg-[#c8e6c9] text-[#0f172a]",
  },
  {
    key: "HP",
    label: "Hải Phòng",
    storeNo: "04",
    name: "solar. Hai Phong",
    address: "01 Lạch Tray, Lê Chân, Hải Phòng",
    time: "09:30 – 22:00",
    phone: "0225 73 071 175",
    rating: 4.7,
    reviews: 33,
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3726.0419618897643!2d106.68128157499548!3d20.86065908963637!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314a7aec3c7e78ef%3A0x6ebde1e8fd8d9e1a!2zTOG6oWNoIFRyYXksIEzDqiBDaMOibiwgSMOjaSBQaMOybmc!5e0!3m2!1svi!2s!4v1715000000003!5m2!1svi!2s",
    mapsUrl: "https://maps.google.com/?q=L%E1%BA%A1ch+Tray+L%C3%AA+Ch%C3%A2n+H%E1%BA%A3i+Ph%C3%B2ng",
    dotColor: "bg-[#ffcdd2]",
    tagColor: "bg-[#ffcdd2] text-[#0f172a]",
  },
];

export default function MapSection() {
  const [active, setActive] = useState("SG");
  const current = stores.find((s) => s.key === active);

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 border-t border-black/10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-6 mb-8">
        <div>
          <div className="inline-block border border-black/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-6 rounded-full">
            05 - Bản đồ
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0f172a]">
            HCM • HN • ĐN • HP.
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="flex bg-white border border-black/10 rounded-full p-1 self-start sm:self-auto gap-1">
          {stores.map((s) => (
            <button
              key={s.key}
              onClick={() => setActive(s.key)}
              className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition ${
                active === s.key
                  ? "bg-[#0f172a] text-white"
                  : "text-[#5c5b5b] hover:bg-[#f3f0ef]"
              }`}
            >
              {s.key}
            </button>
          ))}
        </div>
      </div>

      {/* Map + Sidebar */}
      <div className="flex flex-col lg:flex-row gap-0 rounded-[2rem] overflow-hidden border border-black/10 shadow-sm" style={{ minHeight: "520px" }}>

        {/* Info Sidebar */}
        <div className="bg-white p-8 flex flex-col justify-between gap-6 lg:w-[300px] shrink-0">
          <div>
            <span className={`inline-block px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-full mb-4 ${current.tagColor}`}>
              Store {current.storeNo}
            </span>
            <h3 className="text-2xl font-extrabold text-[#0f172a] mb-1">{current.name}</h3>
            <p className="text-sm text-[#5c5b5b] font-medium mb-6">{current.address}</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-yellow-400 text-sm">★★★★★</span>
              <span className="text-sm font-bold text-[#0f172a]">{current.rating}</span>
              <span className="text-xs text-[#94a3b8]">({current.reviews} đánh giá)</span>
            </div>

            {/* Hours */}
            <div className="bg-[#f3f0ef] rounded-xl p-4 flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shrink-0"></div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#94a3b8] mb-0.5">Giờ mở cửa</p>
                <p className="text-sm font-bold text-[#0f172a]">{current.time}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-[#f3f0ef] rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#94a3b8] mb-0.5">Hotline</p>
              <p className="text-sm font-bold text-[#0f172a]">{current.phone}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <a
              href={current.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#0f172a] text-white px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black transition text-center"
            >
              Chỉ đường →
            </a>
            <a
              href={`tel:${current.phone.replace(/\s/g, "")}`}
              className="w-full bg-transparent border border-black/10 text-[#0f172a] px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#f3f0ef] transition text-center"
            >
              Gọi ngay
            </a>
          </div>
        </div>

        {/* Google Maps Embed */}
        <div className="flex-1 relative min-h-[400px]">
          {stores.map((s) => (
            <iframe
              key={s.key}
              src={s.mapSrc}
              title={`Bản đồ ${s.name}`}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className={`absolute inset-0 w-full h-full border-0 transition-opacity duration-300 ${
                active === s.key ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
