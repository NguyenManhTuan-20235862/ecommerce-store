import { X, ZoomIn } from "lucide-react";
import { useState } from "react";

const IMAGES = [
  { src: "src/assets/Cat.png",    alt: "Cắt rập da bò",  label: "✦ cắt",  labelBg: "#ffcdd2", labelText: "#0f172a" },
  { src: "src/assets/Khau.png",   alt: "Khâu sole tay",  label: "✦ khâu", labelBg: "#c8e6c9", labelText: "#0f172a" },
  { src: "src/assets/Danhso.png", alt: "Đánh số",        label: "✦ số",   labelBg: "#ff6b35", labelText: "#fff"    },
  { src: "src/assets/Ktra.png",   alt: "Kiểm tra QC",    label: "✦ kiểm", labelBg: "#004be3", labelText: "#fff"    },
  { src: "src/assets/Goi.png",    alt: "Đóng gói",       label: "✦ gói",  labelBg: "#f3f0ef", labelText: "#0f172a" },
];

function ImageCell({ image, onClick, className }) {
  return (
    <div
      className={`relative bg-white/5 rounded-[2rem] overflow-hidden group border border-white/10 cursor-zoom-in ${className}`}
      onClick={onClick}
    >
      <img
        src={image.src}
        alt={image.alt}
        className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

      {/* Label */}
      <div className="absolute top-4 left-4 z-10">
        <div
          className="inline-block px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full"
          style={{ backgroundColor: image.labelBg, color: image.labelText }}
        >
          {image.label}
        </div>
      </div>

      {/* Zoom hint */}
      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition">
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
          <ZoomIn className="w-3.5 h-3.5 text-white" />
        </div>
      </div>

      {/* Caption (chỉ ô lớn) */}
      {(image.alt === "Cắt rập da bò" || image.alt === "Khâu sole tay") && (
        <div className="absolute bottom-4 left-4 z-10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
            {image.alt}
          </p>
        </div>
      )}
    </div>
  );
}

export default function WorkshopSection() {
  const [lightbox, setLightbox] = useState(null); // index of opened image

  const prev = () => setLightbox((i) => (i - 1 + IMAGES.length) % IMAGES.length);
  const next = () => setLightbox((i) => (i + 1) % IMAGES.length);

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
      <div className="bg-[#1e293b] rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row gap-16 items-center">
        {/* Left Content */}
        <div className="flex-1 max-w-xl text-white">
          <div className="inline-block bg-[#ff6b35] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white mb-8 rounded-full">
            03 - Xưởng
          </div>

          <h2 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1] mb-8 text-white">
            <span className="text-[#ffcdd2] italic font-serif lowercase">
              Sáu ngày
            </span>{" "}
            để hoàn thành một đôi giày.
          </h2>

          <p className="text-white/80 text-base leading-relaxed font-medium mb-12">
            8 đồng nghiệp ở hai xưởng — Sài Gòn (Q.04) và Hà Nội (Đống Đa). Mọi
            sản phẩm da đi qua sáu bàn: cắt, ghép, khâu, đánh số, kiểm tra, đóng
            gói.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-12">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="text-3xl font-extrabold mb-1">98.4%</p>
              <p className="text-xs text-white/60 font-medium">QC pass rate</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="text-3xl font-extrabold mb-1">06 ngày</p>
              <p className="text-xs text-white/60 font-medium">Trung bình / đơn</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="text-3xl font-extrabold mb-1">08 người</p>
              <p className="text-xs text-white/60 font-medium">Đồng nghiệp</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="text-3xl font-extrabold mb-1">
                60%<span className="text-xl">+</span>
              </p>
              <p className="text-xs text-white/60 font-medium">Nguyên liệu nội địa</p>
            </div>
          </div>

          <button className="bg-[#ff6b35] text-white px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-[#e85b2a] transition">
            Đặt lịch ghé xưởng →
          </button>
        </div>

        {/* Right Images (Process Grid) */}
        <div className="flex-1 w-full grid grid-cols-6 grid-rows-2 gap-4 h-[500px] lg:h-[600px]">
          <ImageCell image={IMAGES[0]} onClick={() => setLightbox(0)} className="col-span-3 row-span-2" />
          <ImageCell image={IMAGES[1]} onClick={() => setLightbox(1)} className="col-span-3 row-span-1" />
          <ImageCell image={IMAGES[2]} onClick={() => setLightbox(2)} className="col-span-1 row-span-1" />
          <ImageCell image={IMAGES[3]} onClick={() => setLightbox(3)} className="col-span-1 row-span-1" />
          <ImageCell image={IMAGES[4]} onClick={() => setLightbox(4)} className="col-span-1 row-span-1" />
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.92)", backdropFilter: "blur(6px)" }}
          onClick={() => setLightbox(null)}
        >
          {/* Close */}
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition z-10"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 sm:left-8 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition z-10 text-white text-xl font-bold"
          >
            ‹
          </button>

          {/* Image */}
          <div
            className="relative max-w-4xl max-h-[85vh] w-full mx-16 flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={IMAGES[lightbox].src}
              alt={IMAGES[lightbox].alt}
              className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
            />
            <div className="flex items-center gap-3">
              <div
                className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full"
                style={{ backgroundColor: IMAGES[lightbox].labelBg, color: IMAGES[lightbox].labelText }}
              >
                {IMAGES[lightbox].label}
              </div>
              <span className="text-white/60 text-sm font-medium">{IMAGES[lightbox].alt}</span>
            </div>

            {/* Dots */}
            <div className="flex gap-2">
              {IMAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setLightbox(i)}
                  className={`w-2 h-2 rounded-full transition ${i === lightbox ? "bg-white" : "bg-white/30"}`}
                />
              ))}
            </div>
          </div>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 sm:right-8 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition z-10 text-white text-xl font-bold"
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}
