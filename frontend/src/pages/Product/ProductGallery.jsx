import { useState } from "react";

export default function ProductGallery({ images, badge }) {
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
                ? "border-2 border-[#004be3] ring-2 ring-[rgba(0,75,227,0.2)]"
                : "bg-[#eae7e7]"
            }`}
          >
            <img
              src={img}
              alt={`product-${idx}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>

      <div className="relative flex-1 overflow-hidden rounded-2xl bg-[#eae7e7]">
        <img
          src={images[mainImageIdx]}
          alt="main product"
          className="h-96 w-full object-cover"
        />
        {badge && (
          <span className="absolute left-4 top-4 inline-block rounded-full bg-[#004be3] px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
