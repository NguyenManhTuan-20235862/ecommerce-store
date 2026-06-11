import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function ProductGallery({ images, badge, productName = "Sản phẩm" }) {
  const [mainImageIdx, setMainImageIdx] = useState(0);

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setMainImageIdx(idx)}
            className={`relative h-24 w-20 overflow-hidden rounded-2xl transition ${
              mainImageIdx === idx
                ? "ring-2 ring-[#004be3] ring-offset-2"
                : "bg-[#e4e2e1] hover:ring-1 hover:ring-[#004be3]/40 hover:ring-offset-1"
            }`}
          >
            <img
              src={img}
              alt={`${productName} - ảnh ${idx + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>

      <div className="relative min-h-[500px] flex-1 overflow-hidden rounded-2xl bg-[#e4e2e1]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={mainImageIdx}
            src={images[mainImageIdx]}
            alt={`${productName} - ảnh chính`}
            className="h-full w-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            style={{ position: "absolute", inset: 0 }}
          />
        </AnimatePresence>
        {badge && (
          <span className="absolute left-4 top-4 inline-block rounded-full bg-[#004be3] px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-[0_8px_20px_rgba(0,75,227,0.3)]">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
