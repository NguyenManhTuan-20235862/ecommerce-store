import { useEffect, useState } from "react";
import { storeService } from "../../../services/store.service";
import { getCityColors } from "../../../utils/cityColors";

export default function MapSection() {
  const [stores, setStores] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => {
    storeService
      .getStores()
      .then((res) => {
        const data = res.data?.data ?? [];
        setStores(data);
        if (data.length > 0) setActive(data[0].cityKey);
      })
      .catch(() => {});
  }, []);

  const current = stores.find((s) => s.cityKey === active);

  if (stores.length === 0) return null;
  if (!current) return null;

  const colors = getCityColors(current.cityKey);

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 border-t border-black/10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-6 mb-8">
        <div>
          <div className="inline-block border border-black/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-6 rounded-full">
            05 - Bản đồ
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0f172a]">
            {stores.map((s) => s.cityKey).join(" • ")}.
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="flex bg-white border border-black/10 rounded-full p-1 self-start sm:self-auto gap-1">
          {stores.map((s) => (
            <button
              key={s.cityKey}
              onClick={() => setActive(s.cityKey)}
              className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition ${
                active === s.cityKey
                  ? "bg-[#0f172a] text-white"
                  : "text-[#5c5b5b] hover:bg-[#f3f0ef]"
              }`}
            >
              {s.cityKey}
            </button>
          ))}
        </div>
      </div>

      {/* Map + Sidebar */}
      <div className="flex flex-col lg:flex-row gap-0 rounded-[2rem] overflow-hidden border border-black/10 shadow-sm" style={{ minHeight: "520px" }}>

        {/* Info Sidebar */}
        <div className="bg-white p-8 flex flex-col justify-between gap-6 lg:w-[300px] shrink-0">
          <div>
            <span className={`inline-block px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-full mb-4 ${colors.tagColor}`}>
              {current.tag || current.cityKey}
            </span>
            <h3 className="text-2xl font-extrabold text-[#0f172a] mb-1">{current.name}</h3>
            <p className="text-sm text-[#5c5b5b] font-medium mb-6">{current.address}</p>

            {/* Rating */}
            {current.rating > 0 && (
              <div className="flex items-center gap-2 mb-6">
                <span className="text-yellow-400 text-sm">★★★★★</span>
                <span className="text-sm font-bold text-[#0f172a]">{current.rating}</span>
                {current.reviews > 0 && (
                  <span className="text-xs text-[#94a3b8]">({current.reviews} đánh giá)</span>
                )}
              </div>
            )}

            {/* Hours */}
            {current.time && (
              <div className="bg-[#f3f0ef] rounded-xl p-4 flex items-center gap-3 mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shrink-0"></div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#94a3b8] mb-0.5">Giờ mở cửa</p>
                  <p className="text-sm font-bold text-[#0f172a]">{current.time}</p>
                </div>
              </div>
            )}

            {/* Phone */}
            {current.phone && (
              <div className="bg-[#f3f0ef] rounded-xl p-4">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#94a3b8] mb-0.5">Hotline</p>
                <p className="text-sm font-bold text-[#0f172a]">{current.phone}</p>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            {current.mapsUrl ? (
              <a
                href={current.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#0f172a] text-white px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black transition text-center"
              >
                Chỉ đường →
              </a>
            ) : (
              <button className="w-full bg-[#0f172a] text-white px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black transition">
                Chỉ đường →
              </button>
            )}
            {current.phone ? (
              <a
                href={`tel:${current.phone.replace(/\s/g, "")}`}
                className="w-full bg-transparent border border-black/10 text-[#0f172a] px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#f3f0ef] transition text-center"
              >
                Gọi ngay
              </a>
            ) : (
              <button className="w-full bg-transparent border border-black/10 text-[#0f172a] px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#f3f0ef] transition">
                Gọi ngay
              </button>
            )}
          </div>
        </div>

        {/* Google Maps Embed */}
        <div className="flex-1 relative min-h-[400px]">
          {stores.map((s) => (
            s.mapSrc ? (
              <iframe
                key={s.cityKey}
                src={s.mapSrc}
                title={`Bản đồ ${s.name}`}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className={`absolute inset-0 w-full h-full border-0 transition-opacity duration-300 ${
                  active === s.cityKey ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              />
            ) : (
              <div
                key={s.cityKey}
                className={`absolute inset-0 bg-[#e2e8f0] flex items-center justify-center transition-opacity duration-300 ${
                  active === s.cityKey ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">
                  Chưa có bản đồ — {s.name}
                </p>
              </div>
            )
          ))}
        </div>
      </div>
    </section>
  );
}
